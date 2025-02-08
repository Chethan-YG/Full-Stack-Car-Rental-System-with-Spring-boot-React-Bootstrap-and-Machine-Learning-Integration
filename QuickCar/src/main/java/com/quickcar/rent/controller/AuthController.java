package com.quickcar.rent.controller;

import java.util.Map;
import java.util.Optional;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.quickcar.rent.dto.JwtAuthenticationResponse;
import com.quickcar.rent.dto.RefreshTokenRequest;
import com.quickcar.rent.dto.ResetPasswordRequest;
import com.quickcar.rent.dto.SignIn;
import com.quickcar.rent.dto.SignUp;
import com.quickcar.rent.entity.User;
import com.quickcar.rent.repository.UserRepository;
import com.quickcar.rent.service.OtpService;
import com.quickcar.rent.service.TempStorageService;
import com.quickcar.rent.service.auth.AuthService;
import com.quickcar.rent.service.mail.MailService;


import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

	private final AuthService authService;
	private final UserRepository userRepository;
	private final MailService mailService;
	private final OtpService otpService;
	private final PasswordEncoder passwordEncoder;
    private final TempStorageService tempStorageService;
    
    @PostMapping("/signup")
	public ResponseEntity<?> signUpCustomer(@RequestBody SignUp signUpRequest) {
	    if (authService.hasCustomerWithEmail(signUpRequest.getEmail())) {
	        return ResponseEntity.status(HttpStatus.CONFLICT).body("Customer with this email id is already registered.");
	    }
	    User createdUser = authService.createCustomer(signUpRequest);
	    return ResponseEntity.status(HttpStatus.CREATED).body(createdUser);
	}

	
	@PostMapping("/signin")
	public ResponseEntity<JwtAuthenticationResponse> signInCustomer(@RequestBody SignIn signInRequest) {
		return ResponseEntity.ok(authService.signIn(signInRequest));
	
	}
	
	@PostMapping("/refresh")
	public ResponseEntity<JwtAuthenticationResponse> refresh(@RequestBody RefreshTokenRequest refreshTokenRequest) {
		return ResponseEntity.ok(authService.refreshToken(refreshTokenRequest));
	
	}

    @GetMapping("/login")
    public String login() {
        return "redirect:http://localhost:3000/login";
    }

	@PostMapping("/forgot-password")
    public ResponseEntity<?> processForgotPassword(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        Optional<User> existingUser = userRepository.findByEmail(email);

        if (!existingUser.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Please enter the correct email.");
        } else {
            String otp = MailService.generateOTP();
            otpService.storeOtp(email, otp);

            String subject = "Forgot Password OTP";
            String message = "Your OTP for password reset is: " + otp;
            mailService.sendMail(email, subject, message);
            tempStorageService.storeData("reset-email", email);

            return ResponseEntity.ok("OTP sent successfully.");
        }
    }
	
	@PostMapping("resend-otp")
	public ResponseEntity<?> ResendOtp(@RequestBody Map<String, String> request) {
	    String email = request.get("email");
	    Optional<User> existingUser = userRepository.findByEmail(email);

	    if (!existingUser.isPresent()) {
	        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Please check your email.");
	    } else {
	        String otp = MailService.generateOTP();
	        otpService.storeOtp(email, otp);

	        String subject = "Resend OTP";
	        String message = "Your OTP for password reset is: " + otp;
	        mailService.sendMail(email, subject, message);
	        tempStorageService.storeData("reset-email", email);

	        return ResponseEntity.ok("OTP sent successfully.");
	    }
	}


    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String enteredOtp = request.get("otp");
        String storedOtp = otpService.getOtp(email);

        if (storedOtp == null || !storedOtp.equals(enteredOtp)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid OTP.");
        }
        otpService.removeOtp(email);

        return ResponseEntity.ok(Map.of("email", email, "message", "OTP verified successfully."));
    }
    


    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody ResetPasswordRequest resetPasswordRequest) {
        String email = tempStorageService.getData("reset-email"); 
        String newPassword = resetPasswordRequest.getNewPassword();
        System.out.println(email+" "+newPassword);

        Optional<User> userOptional = userRepository.findByEmail(email);
        if (!userOptional.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "User not found with this email."));
        }

        User user = userOptional.get();
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        tempStorageService.removeData("reset-email");
        return ResponseEntity.ok(Map.of("message", "Password reset successfully."));
    }

}
