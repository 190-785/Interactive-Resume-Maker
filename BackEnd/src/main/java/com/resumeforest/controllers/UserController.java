package com.resumeforest.controllers;

import com.resumeforest.models.User;
import com.resumeforest.services.UserService;
import com.resumeforest.payload.request.LoginRequest;
import com.resumeforest.payload.request.PasswordChangeRequest;
import com.resumeforest.payload.request.RegisterRequest;
import com.resumeforest.payload.request.UserUpdateRequest;
import com.resumeforest.payload.response.JwtResponse;
import com.resumeforest.payload.response.MessageResponse;
import com.resumeforest.security.jwt.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.validation.Valid;
import java.io.IOException;
import java.util.Optional;

@RestController
@RequestMapping("/api")
public class UserController {
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private AuthenticationManager authenticationManager;
    
    @Autowired
    private JwtUtils jwtUtils;
    
    /**
     * Register a new user
     */
    // @PostMapping("/auth/register") // Commented out to resolve ambiguous mapping with AuthApiController
    public ResponseEntity<?> registerUser(@Valid @RequestBody RegisterRequest registerRequest) {
        try {
            User user = new User();
            user.setUsername(registerRequest.getUsername());
            user.setEmail(registerRequest.getEmail());
            user.setPassword(registerRequest.getPassword());
            user.setFullName(registerRequest.getFullName());
            user.setBio(registerRequest.getBio() != null ? registerRequest.getBio() : "");
            
            User registeredUser = userService.registerUser(user);
            
            // Authenticate the user after registration
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(registerRequest.getUsername(), registerRequest.getPassword())
            );
            
            SecurityContextHolder.getContext().setAuthentication(authentication);
            String jwt = jwtUtils.generateJwtToken(authentication);
            
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            
            return ResponseEntity.status(HttpStatus.CREATED).body(new JwtResponse(
                jwt,
                registeredUser.getId(),
                userDetails.getUsername(),
                registeredUser.getEmail(),
                registeredUser.getFullName(),
                registeredUser.getBio(),
                registeredUser.getJoinedAt().toString(),
                registeredUser.getAvatarUrl()
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }
    
    /**
     * Login a user - DEPRECATED
     * This endpoint has been moved to AuthApiController to resolve mapping conflicts
     */
    // @PostMapping("/auth/login") - Commented out to resolve ambiguous mapping
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        // Method intentionally disabled - use AuthApiController instead
        return ResponseEntity.status(HttpStatus.GONE)
            .body(new MessageResponse("This endpoint has moved to /api/auth/login. Please update your client."));
    }
    
    /**
     * Get current user profile
     */
    @GetMapping("/users/current")
    public ResponseEntity<?> getCurrentUser(Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new MessageResponse("Not authenticated"));
        }
        
        Optional<User> user = userService.getUserByUsername(authentication.getName());
        
        if (!user.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new MessageResponse("User not found"));
        }
        
        User userData = user.get();
        // Don't return password
        userData.setPassword(null);
        
        return ResponseEntity.ok(userData);
    }
    
    /**
     * Update user profile
     */
    @PutMapping("/users/profile")
    public ResponseEntity<?> updateUserProfile(
        Authentication authentication,
        @Valid @RequestBody UserUpdateRequest updateRequest
    ) {
        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new MessageResponse("Not authenticated"));
        }
        
        Optional<User> userOpt = userService.getUserByUsername(authentication.getName());
        
        if (!userOpt.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new MessageResponse("User not found"));
        }
        
        try {
            User user = userOpt.get();
            User updatedUser = new User();
            
            updatedUser.setFullName(updateRequest.getFullName());
            updatedUser.setEmail(updateRequest.getEmail());
            updatedUser.setBio(updateRequest.getBio());
            
            User result = userService.updateUserProfile(user.getId(), updatedUser);
            // Don't return password
            result.setPassword(null);
            
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }
    
    /**
     * Change user password
     */
    @PutMapping("/users/password")
    public ResponseEntity<?> changePassword(
        Authentication authentication,
        @Valid @RequestBody PasswordChangeRequest passwordRequest
    ) {
        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new MessageResponse("Not authenticated"));
        }
        
        Optional<User> userOpt = userService.getUserByUsername(authentication.getName());
        
        if (!userOpt.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new MessageResponse("User not found"));
        }
        
        boolean passwordChanged = userService.changePassword(
            userOpt.get().getId(),
            passwordRequest.getCurrentPassword(),
            passwordRequest.getNewPassword()
        );
        
        if (passwordChanged) {
            return ResponseEntity.ok(new MessageResponse("Password changed successfully"));
        } else {
            return ResponseEntity.badRequest().body(new MessageResponse("Current password is incorrect"));
        }
    }
    
    /**
     * Upload user avatar
     */
    @PostMapping("/users/avatar")
    public ResponseEntity<?> uploadAvatar(
        Authentication authentication,
        @RequestParam("avatar") MultipartFile file
    ) {
        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new MessageResponse("Not authenticated"));
        }
        
        Optional<User> userOpt = userService.getUserByUsername(authentication.getName());
        
        if (!userOpt.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new MessageResponse("User not found"));
        }
        
        try {
            // In a real implementation, you would:
            // 1. Check if the file is an image
            // 2. Resize the image if needed
            // 3. Upload to a storage service (S3, etc.)
            // 4. Store the URL in the database
            
            // For now, we'll just return a mock URL
            String avatarUrl = "/uploads/avatars/user_" + userOpt.get().getId() + "_" + System.currentTimeMillis() + ".jpg";
            
            User user = userOpt.get();
            User updatedUser = new User();
            updatedUser.setAvatarUrl(avatarUrl);
            
            User result = userService.updateUserProfile(user.getId(), updatedUser);
            
            return ResponseEntity.ok(new MessageResponse("Avatar uploaded successfully")
                .addData("avatarUrl", result.getAvatarUrl()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new MessageResponse("Error uploading avatar: " + e.getMessage()));
        }
    }
}
