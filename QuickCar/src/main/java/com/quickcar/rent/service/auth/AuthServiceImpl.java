package com.quickcar.rent.service.auth;

import java.util.HashMap;
import java.util.Map;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.quickcar.rent.dto.JwtAuthenticationResponse;
import com.quickcar.rent.dto.RefreshTokenRequest;
import com.quickcar.rent.dto.SignIn;
import com.quickcar.rent.dto.SignUp;
import com.quickcar.rent.entity.User;
import com.quickcar.rent.enums.UserRole;
import com.quickcar.rent.repository.UserRepository;
import com.quickcar.rent.utils.JWTUtil;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JWTUtil jwtService;


	
    @PostConstruct
    public void createAdminAccount() {
        User adminAccount = userRepository.findByUserRole(UserRole.ADMIN);
        if (adminAccount == null) {
            User newAdminAccount = new User();
            newAdminAccount.setName("ADMIN");
            newAdminAccount.setEmail("admin57@gmail.com");
            newAdminAccount.setPassword(passwordEncoder.encode("admin57"));
            newAdminAccount.setUserRole(UserRole.ADMIN);
            User createdAdmin = userRepository.save(newAdminAccount);
            System.out.println(createdAdmin);
        }
    }

    @Override
    public User createCustomer(SignUp signUpRequest) {
        User user = new User();
        user.setName(signUpRequest.getName());
        user.setEmail(signUpRequest.getEmail());
        user.setPassword(passwordEncoder.encode(signUpRequest.getPassword()));
        user.setUserRole(UserRole.CUSTOMER);
        return userRepository.save(user);
        
    }

    @Override
    public boolean hasCustomerWithEmail(String email) {
        return userRepository.findByEmail(email).isPresent();
    }
    
    
    @Override
    public JwtAuthenticationResponse signIn(SignIn signin) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(signin.getEmail(), signin.getPassword()));

        var user = userRepository.findByEmail(signin.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Invalid Email or Password"));

        Map<String, Object> claims = new HashMap<>();
        claims.put("name", user.getName());
        claims.put("email", user.getEmail());
        claims.put("role", user.getUserRole().name());
        claims.put("userId", user.getId());

        String jwt = jwtService.generateToken(user.getEmail() ,claims);
        String refreshToken = jwtService.generateRefreshToken(user.getEmail(), claims);

        return new JwtAuthenticationResponse(jwt, refreshToken);
    }

    @Override
    public JwtAuthenticationResponse refreshToken(RefreshTokenRequest refreshTokenRequest) {
        String email = jwtService.extractUserName(refreshTokenRequest.getToken());

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found for the given token"));

        if (jwtService.isTokenValid(refreshTokenRequest.getToken(), user)) {
            Map<String, Object> claims = new HashMap<>();
            claims.put("name", user.getName());
            claims.put("email", user.getEmail());
            claims.put("role", user.getUserRole().name());
            claims.put("userId", user.getId());

            String newJwt = jwtService.generateToken(user.getEmail(),claims);

            return new JwtAuthenticationResponse(newJwt, refreshTokenRequest.getToken());
        } else {
            throw new IllegalArgumentException("Invalid or expired refresh token");
        }
    }
}
