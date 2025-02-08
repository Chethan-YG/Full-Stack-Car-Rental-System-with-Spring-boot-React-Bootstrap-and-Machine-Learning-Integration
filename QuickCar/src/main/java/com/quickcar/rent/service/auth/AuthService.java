package com.quickcar.rent.service.auth;


import com.quickcar.rent.dto.JwtAuthenticationResponse;
import com.quickcar.rent.dto.RefreshTokenRequest;
import com.quickcar.rent.dto.SignIn;
import com.quickcar.rent.dto.SignUp;
import com.quickcar.rent.entity.User;

public interface AuthService {
	
	User createCustomer(SignUp signUpRequest);
	boolean hasCustomerWithEmail(String email);
	JwtAuthenticationResponse signIn(SignIn signin);
	JwtAuthenticationResponse refreshToken(RefreshTokenRequest refreshTokenRequest);

}
