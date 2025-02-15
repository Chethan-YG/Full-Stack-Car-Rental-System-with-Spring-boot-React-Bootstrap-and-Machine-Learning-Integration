package com.quickcar.rent.utils;

import java.security.Key;
import java.util.Date;
import java.util.Map;
import java.util.function.Function;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

@Component
public class JWTUtil {

	@Value("${jwt.secret}")
	private String SECRET_KEY;

	public String generateToken(String userEmail, Map<String, Object> claims) {
		return Jwts.builder().setClaims(claims).setSubject(userEmail)
				.setIssuedAt(new Date(System.currentTimeMillis()))
				.setExpiration(new Date(System.currentTimeMillis() + 1000 * 5)) // 1 day expiration
				.signWith(getSigningKey(), SignatureAlgorithm.HS256).compact();
	}

	public String extractUserName(String token) {
		return extractClaim(token, Claims::getSubject);
	}

	public Claims extractAllClaims(String token) {

		return Jwts.parserBuilder().setSigningKey(getSigningKey()).build().parseClaimsJws(token).getBody();

	}

	private <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
		final Claims claims = extractAllClaims(token);
		return claimsResolver.apply(claims);
	}

	private Key getSigningKey() {
		byte[] keyBytes = Decoders.BASE64.decode(SECRET_KEY);
		return Keys.hmacShaKeyFor(keyBytes);
	}

	public boolean isTokenValid(String token, UserDetails userDetails) {
		final String userName = extractUserName(token);
		return (userName != null && userName.equals(userDetails.getUsername())) && !isTokenExpired(token);
	}

	public boolean isTokenExpired(String token) {
		return extractExpiration(token).before(new Date());
	}

	private Date extractExpiration(String token) {
		return extractClaim(token, Claims::getExpiration);
	}

	public String generateRefreshToken(String userEmail, Map<String, Object> claims) {
		return Jwts.builder().setClaims(claims).setSubject(userEmail).setIssuedAt(new Date(System.currentTimeMillis()))
				.setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 24 * 7)) // 7 days expiration
				.signWith(getSigningKey(), SignatureAlgorithm.HS256).compact();
	}
}
