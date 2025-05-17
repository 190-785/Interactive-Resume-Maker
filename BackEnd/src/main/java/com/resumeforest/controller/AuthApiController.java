package com.resumeforest.controller;

import com.resumeforest.model.User;
import com.resumeforest.payload.LoginRequest;
import com.resumeforest.payload.SignUpRequest;
import com.resumeforest.repository.UserRepository;
import com.resumeforest.security.JwtTokenProvider;
import com.resumeforest.service.UserService;
import io.jsonwebtoken.JwtException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthApiController {

    private static final Logger logger = LoggerFactory.getLogger(AuthApiController.class);

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider tokenProvider;

    @Autowired
    private UserService userService;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            logger.debug("Attempting login for user: {}", loginRequest.getUsername());
            
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                    loginRequest.getUsername(),
                    loginRequest.getPassword()
                )
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);
            
            logger.debug("User {} authenticated successfully. Generating token...", loginRequest.getUsername());
            String jwt = tokenProvider.generateToken(authentication);
            logger.debug("Token generated successfully for user: {}", loginRequest.getUsername());

            Map<String, Object> responseBody = new HashMap<>();
            responseBody.put("success", true);
            responseBody.put("token", jwt);

            String username = authentication.getName();
            logger.debug("Fetching user details for: {}", username);
            Optional<User> userOptional = userService.findByUsername(username); 
            
            if (userOptional.isPresent()) {
                User user = userOptional.get();
                logger.debug("User object retrieved: {}", user); // Log the whole user object if its toString() is reasonable
                logger.debug("User ID: {}", user.getId());
                logger.debug("Username: {}", user.getUsername());
                logger.debug("Email: {}", user.getEmail());
                logger.debug("Full Name: {}", user.getFullName());

                responseBody.put("userId", user.getId());
                responseBody.put("username", user.getUsername());
                responseBody.put("email", user.getEmail());
                responseBody.put("fullName", user.getFullName());
                logger.debug("User details added to response for: {}", username);
            } else {
                logger.warn("User {} authenticated but not found in repository for details. This is unexpected.", username);
            }
            
            return ResponseEntity.ok(responseBody);

        } catch (AuthenticationException e) {
            logger.warn("Authentication failed for user {}: {}", loginRequest.getUsername(), e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("success", false, "error", "Invalid username or password"));
        } catch (Exception e) {
            logger.error("Internal server error during login process for user {}: {}", loginRequest.getUsername(), e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("success", false, "error", "An internal error occurred during login. Please check server logs."));
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignUpRequest signUpRequest) {
        try {
            User newUser = userService.registerUser(
                signUpRequest.getUsername(),
                signUpRequest.getEmail(),
                signUpRequest.getPassword(),
                signUpRequest.getName()
            );

            Map<String, Object> responseBody = new HashMap<>();
            responseBody.put("success", true);
            responseBody.put("message", "User registered successfully");
            responseBody.put("userId", newUser.getId());
            responseBody.put("username", newUser.getUsername());
            responseBody.put("email", newUser.getEmail());
            responseBody.put("fullName", newUser.getFullName());
            
            return ResponseEntity.status(HttpStatus.CREATED).body(responseBody);

        } catch (RuntimeException e) { 
            logger.warn("Registration attempt failed for {}: {}", signUpRequest.getUsername(), e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("success", false, "error", e.getMessage()));
        } catch (Exception e) {
            logger.error("Unexpected error during user registration for {}: {}", signUpRequest.getUsername(), e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("success", false, "error", "An unexpected error occurred during registration."));
        }
    }
    
    @GetMapping("/user/me")
    public ResponseEntity<?> getCurrentUser() {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getName())) {
                 return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("success", false, "error", "User not authenticated."));
            }
            String username = auth.getName();
            Optional<User> userOpt = userService.findByUsername(username);
            
            if (userOpt.isEmpty()) {
                logger.warn("Authenticated user {} not found in database.", username);
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("success", false, "error", "Authenticated user details not found."));
            }
            
            User user = userOpt.get();
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("id", user.getId());
            response.put("username", user.getUsername());
            response.put("email", user.getEmail());
            response.put("fullName", user.getFullName());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Failed to retrieve user profile", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("success", false, "error", "Failed to retrieve user profile: " + e.getMessage()));
        }
    }

    @GetMapping("/check-username")
    public ResponseEntity<?> checkUsername(@RequestParam String username) {
        try {
            boolean exists = userService.findByUsername(username).isPresent();
            return ResponseEntity.ok(Map.of("available", !exists, "success", true));
        } catch (Exception e) {
            logger.error("Error checking username availability for {}: {}", username, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("success", false, "error", "Error checking username availability."));
        }
    }

    @GetMapping("/check-email")
    public ResponseEntity<?> checkEmail(@RequestParam String email) {
        try {
            boolean exists = userService.findByEmail(email).isPresent();
            return ResponseEntity.ok(Map.of("available", !exists, "success", true));
        } catch (Exception e) {
            logger.error("Error checking email availability for {}: {}", email, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("success", false, "error", "Error checking email availability."));
        }
    }

    @GetMapping("/validate-token")
    public ResponseEntity<?> validateToken(@RequestHeader("Authorization") String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("success", false, "valid", false, "message", "Authorization header is missing or not Bearer type"));
        }
        String token = authHeader.substring(7);

        try {
            if (!tokenProvider.validateToken(token)) {
                logger.debug("Token validation failed by tokenProvider.validateToken (details not logged).");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("success", false, "valid", false, "message", "Token is invalid or expired."));
            }

            String username = tokenProvider.getUsernameFromJWT(token);
            Optional<User> userOpt = userService.findByUsername(username); 

            if (userOpt.isPresent()) {
                User user = userOpt.get();
                Map<String, Object> responseMap = new HashMap<>();
                responseMap.put("success", true);
                responseMap.put("valid", true);
                responseMap.put("userId", user.getId());
                responseMap.put("username", user.getUsername());
                return ResponseEntity.ok(responseMap);
            } else {
                logger.warn("Valid token processed for a user not found in repository: {}", username);
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("success", false, "valid", false, "message", "User associated with token not found."));
            }
        } catch (JwtException jwtEx) { 
            logger.warn("JWT processing error: {}. Token: {}", jwtEx.getMessage(), token);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("success", false, "valid", false, "message", "Error processing token: " + jwtEx.getMessage()));
        } 
        catch (Exception e) { 
            logger.error("Unexpected error during token validation: {}. Token: {}", e.getMessage(), token, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("success", false, "valid", false, "message", "An unexpected server error occurred during token validation."));
        }
    }
}