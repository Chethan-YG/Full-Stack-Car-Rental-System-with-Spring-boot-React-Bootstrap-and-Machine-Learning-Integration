package com.quickcar.rent.service.auth;

import com.quickcar.rent.utils.JWTUtil;
import com.quickcar.rent.entity.User;
import com.quickcar.rent.enums.UserRole;
import com.quickcar.rent.repository.UserRepository;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class CustomOAuth2AuthenticationSuccessHandler implements AuthenticationSuccessHandler {

	
	@Value("${frontend.base.url}")
	private String baseUrl;
	
    private final UserRepository userRepository;
    private final JWTUtil jwtService;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException, ServletException {

        OAuth2AuthenticationToken oauthToken = (OAuth2AuthenticationToken) authentication;
        String name = ((DefaultOAuth2User) oauthToken.getPrincipal()).getAttribute("name");
        String email = ((DefaultOAuth2User) oauthToken.getPrincipal()).getAttribute("email");
        Optional<User> existingUser = userRepository.findByEmail(email);
        User user;
        if (existingUser.isPresent()) {
            user = existingUser.get();
        } else {
            // Save new user
            user = new User();
            user.setName(name);
            user.setEmail(email);
            user.setPassword(passwordEncoder.encode("Ht7#Kl2$")); 
            user.setUserRole(UserRole.CUSTOMER);
            userRepository.save(user);
        }

        Map<String, Object> claims = new HashMap<>();
        claims.put("name", user.getName());
        claims.put("email", user.getEmail());
        claims.put("role", user.getUserRole().name());
        claims.put("userId", user.getId());

        String jwt = jwtService.generateToken(user.getEmail(), claims);
        String refreshToken = jwtService.generateRefreshToken(user.getEmail(), claims);
        
        String redirectUrl = createRedirectUrl(baseUrl, jwt, refreshToken);
        response.sendRedirect(redirectUrl);
    }
    
    public static String createRedirectUrl(String baseUrl, String token, String refresh) {
        return String.format("%s/login?token=%s&refresh=%s",
                baseUrl, token, refresh);
    }
}
