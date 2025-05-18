package com.resumeforest.services;

import com.resumeforest.models.User;
import com.resumeforest.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class UserService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
      /**
     * Register a new user
     * @param user The user to register
     * @return The registered user
     */
    public User registerUser(User user) {
        // Check if username or email already exists
        if (userRepository.existsByUsername(user.getUsername())) {
            throw new RuntimeException("Username already exists");
        }
        
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Email already exists");
        }
        
        // Encode password
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        
        // Set join date if not already set
        if (user.getJoinedAt() == null) {
            user.setJoinedAt(LocalDateTime.now());
        }
        
        // Initialize empty fields if they're null
        if (user.getBio() == null) {
            user.setBio("");
        }
        
        if (user.getFullName() == null) {
            user.setFullName("");
        }
        
        // Save the user
        return userRepository.save(user);
    }
    
    /**
     * Register a new user (for backward compatibility)
     * @param username The username
     * @param email The email
     * @param password The raw password
     * @param fullName The full name
     * @return The registered user
     */
    public User registerUser(String username, String email, String password, String fullName) {
        User user = new User();
        user.setUsername(username);
        user.setEmail(email);
        user.setPassword(password);
        user.setFullName(fullName);
        return registerUser(user);
    }
      /**
     * Get a user by username
     * @param username The username to lookup
     * @return The user if found
     */
    public Optional<User> getUserByUsername(String username) {
        return userRepository.findByUsername(username);
    }
      /**
     * Get a user by username (alias for getUserByUsername for backwards compatibility)
     * @param username The username to lookup
     * @return The user if found
     */    public Optional<User> findByUsername(String username) {
        return getUserByUsername(username);
    }
    
    /**
     * Get a user by ID
     * @param id The user ID
     * @return The user if found
     */
    public Optional<User> getUserById(String id) {
        return userRepository.findById(id);
    }
      /**
     * Get a user by email
     * @param email The email to lookup
     * @return The user if found
     */
    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }
    
    /**
     * Get a user by email (alias for getUserByEmail for backwards compatibility)
     * @param email The email to lookup
     * @return The user if found
     */
    public Optional<User> findByEmail(String email) {
        return getUserByEmail(email);
    }
    
    /**
     * Update user profile
     * @param userId The user ID
     * @param updatedUser The updated user data
     * @return The updated user
     */
    public User updateUserProfile(String userId, User updatedUser) {
        Optional<User> existingUserOpt = userRepository.findById(userId);
        
        if (!existingUserOpt.isPresent()) {
            throw new RuntimeException("User not found");
        }
        
        User existingUser = existingUserOpt.get();
        
        // Update fields that can be changed
        if (updatedUser.getFullName() != null) {
            existingUser.setFullName(updatedUser.getFullName());
        }
        
        if (updatedUser.getBio() != null) {
            existingUser.setBio(updatedUser.getBio());
        }
        
        if (updatedUser.getEmail() != null) {
            // Check if new email already exists for a different user
            Optional<User> userWithEmail = userRepository.findByEmail(updatedUser.getEmail());
            if (userWithEmail.isPresent() && !userWithEmail.get().getId().equals(userId)) {
                throw new RuntimeException("Email already in use");
            }
            existingUser.setEmail(updatedUser.getEmail());
        }
        
        if (updatedUser.getAvatarUrl() != null) {
            existingUser.setAvatarUrl(updatedUser.getAvatarUrl());
        }
        
        // Save and return the updated user
        return userRepository.save(existingUser);
    }
    
    /**
     * Change user password
     * @param userId The user ID
     * @param currentPassword The current password
     * @param newPassword The new password
     * @return True if password was changed, false otherwise
     */
    public boolean changePassword(String userId, String currentPassword, String newPassword) {
        Optional<User> userOpt = userRepository.findById(userId);
        
        if (!userOpt.isPresent()) {
            return false;
        }
        
        User user = userOpt.get();
        
        // Verify current password
        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            return false;
        }
        
        // Set new password
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        
        return true;
    }
}
