package com.resumeforest.controllers;

import com.resumeforest.models.Resume;
import com.resumeforest.models.User;
import com.resumeforest.services.ResumeService;
import com.resumeforest.services.UserService;
import com.resumeforest.payload.response.MessageResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/resumes")
@CrossOrigin(origins = "*", maxAge = 3600)
public class ResumeController {    @Autowired
    private ResumeService resumeService;
    
    @Autowired
    private UserService userService;

    /**
     * Get current user's primary resume
     */
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUserResume(Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(new MessageResponse("Not authenticated"));
        }        try {
            Optional<Resume> resume = resumeService.getUserPrimaryResume(authentication.getName());
            if (resume.isPresent()) {
                return ResponseEntity.ok(resume.get());
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new MessageResponse("No resume found"));
            }
        }catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new MessageResponse("Error retrieving resume: " + e.getMessage()));
        }
    }

    /**
     * Get a specific resume by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getResumeById(@PathVariable String id, Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(new MessageResponse("Not authenticated"));
        }

        try {
            Optional<Resume> resume = resumeService.getResumeById(id);
            if (resume.isPresent()) {
                // Check if user owns this resume or if it's public
                if (resume.get().getUserId().equals(getUserIdFromAuth(authentication)) || resume.get().isPublic()) {
                    return ResponseEntity.ok(resume.get());
                } else {
                    return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new MessageResponse("Access denied"));
                }
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new MessageResponse("Resume not found"));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new MessageResponse("Error retrieving resume: " + e.getMessage()));
        }
    }

    /**
     * Create or update user's primary resume
     */
    @PostMapping("/me")
    public ResponseEntity<?> createOrUpdateResume(
            @RequestBody Map<String, Object> resumeData,
            Authentication authentication) {
        
        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(new MessageResponse("Not authenticated"));
        }

        try {
            String userId = getUserIdFromAuth(authentication);
            Resume resume = resumeService.createOrUpdateUserPrimaryResume(userId, resumeData);
            return ResponseEntity.ok(resume);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new MessageResponse("Error saving resume: " + e.getMessage()));
        }
    }

    /**
     * Update specific resume by ID
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> updateResume(
            @PathVariable String id,
            @RequestBody Map<String, Object> resumeData,
            Authentication authentication) {
        
        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(new MessageResponse("Not authenticated"));
        }

        try {
            String userId = getUserIdFromAuth(authentication);
            Optional<Resume> existingResume = resumeService.getResumeById(id);
            
            if (!existingResume.isPresent()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new MessageResponse("Resume not found"));
            }
            
            if (!existingResume.get().getUserId().equals(userId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(new MessageResponse("Access denied"));
            }

            Resume updatedResume = resumeService.updateResume(id, resumeData);
            return ResponseEntity.ok(updatedResume);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new MessageResponse("Error updating resume: " + e.getMessage()));
        }
    }

    /**
     * Get all resumes for current user
     */
    @GetMapping
    public ResponseEntity<?> getUserResumes(Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(new MessageResponse("Not authenticated"));
        }

        try {
            String userId = getUserIdFromAuth(authentication);
            List<Resume> resumes = resumeService.getUserResumes(userId);
            return ResponseEntity.ok(resumes);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new MessageResponse("Error retrieving resumes: " + e.getMessage()));
        }
    }

    /**
     * Delete a resume
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteResume(@PathVariable String id, Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(new MessageResponse("Not authenticated"));
        }

        try {
            String userId = getUserIdFromAuth(authentication);
            Optional<Resume> resume = resumeService.getResumeById(id);
            
            if (!resume.isPresent()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new MessageResponse("Resume not found"));
            }
            
            if (!resume.get().getUserId().equals(userId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(new MessageResponse("Access denied"));
            }

            resumeService.deleteResume(id);
            return ResponseEntity.ok(new MessageResponse("Resume deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new MessageResponse("Error deleting resume: " + e.getMessage()));
        }
    }

    /**
     * Get default resume template (public endpoint)
     */
    @GetMapping("/default-template")
    public ResponseEntity<?> getDefaultTemplate() {
        try {
            // Create a default template
            Map<String, Object> defaultTemplate = new HashMap<>();
            defaultTemplate.put("aboutMe", "Welcome to your interactive resume! Click edit to personalize this content.");
            defaultTemplate.put("skills", "Add your skills here - programming languages, frameworks, tools, etc.");
            defaultTemplate.put("experience", "Describe your work experience, internships, and professional achievements.");
            defaultTemplate.put("projects", "Showcase your projects, including technologies used and outcomes achieved.");
            defaultTemplate.put("education", "List your educational background, degrees, certifications, and relevant coursework.");
            
            return ResponseEntity.ok(defaultTemplate);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new MessageResponse("Error retrieving default template: " + e.getMessage()));
        }
    }

    /**
     * Helper method to extract user ID from authentication
     */
    private String getUserIdFromAuth(Authentication authentication) {
        try {
            Optional<User> user = userService.getUserByUsername(authentication.getName());
            if (user.isPresent()) {
                return user.get().getId();
            }
            throw new RuntimeException("User not found");
        } catch (Exception e) {
            throw new RuntimeException("Error getting user ID: " + e.getMessage());
        }
    }
}
