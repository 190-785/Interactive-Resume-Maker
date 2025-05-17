package com.resumeforest.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import javax.annotation.PostConstruct;
import javax.crypto.spec.SecretKeySpec;
import java.util.Base64;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

import io.jsonwebtoken.JwtParser;

@Component
public class JwtTokenProvider {

    @Value("${app.jwtSecret}")
    private String jwtSecret;

    @Value("${app.jwtExpirationInMs}")
    private int jwtExpirationInMs;

    private Key key;
    private JwtParser parser;

    @PostConstruct
    public void init() {
        byte[] apiKeySecretBytes = Base64.getDecoder().decode(jwtSecret);
        this.key = new SecretKeySpec(apiKeySecretBytes, SignatureAlgorithm.HS512.getJcaName());
        this.parser = Jwts.parser().setSigningKey(key);
    }    public String generateToken(String username) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtExpirationInMs);

        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(SignatureAlgorithm.HS512, key)
                .compact();
    }
    
    public String generateToken(Authentication authentication) {
        org.springframework.security.core.userdetails.User userPrincipal = 
            (org.springframework.security.core.userdetails.User) authentication.getPrincipal();
        return generateToken(userPrincipal.getUsername());
    }

    public String getUsernameFromJWT(String token) {
        Claims claims = parser.parseClaimsJws(token).getBody();
        return claims.getSubject();
    }

    public boolean validateToken(String authToken) {
        try {
            parser.parseClaimsJws(authToken);
            return true;
        } catch (Exception ex) {
            // Log the exception or handle it accordingly
        }
        return false;
    }
}
