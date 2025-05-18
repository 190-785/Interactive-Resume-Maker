package com.resumeforest.config;

import com.resumeforest.models.User;
import com.resumeforest.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserService userService;

    @Override
    public void run(String... args) throws Exception {
        // Add a test user if not already present
        String testUsername = "testuser";
        String testEmail = "testuser@example.com";
        String testPassword = "Test@123";
        String testFullName = "Test User";

        if (userService.findByUsername(testUsername).isEmpty()) {
            try {
                userService.registerUser(testUsername, testEmail, testPassword, testFullName);
                System.out.println("Test user created: " + testUsername);
            } catch (Exception e) {
                System.err.println("Failed to create test user: " + e.getMessage());
            }
        }
    }
}
