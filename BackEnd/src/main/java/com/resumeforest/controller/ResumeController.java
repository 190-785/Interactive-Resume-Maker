package com.resumeforest.controller;

import com.resumeforest.model.Resume;
import com.resumeforest.model.User;
import com.resumeforest.service.ResumeService;
import com.resumeforest.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Controller
@RequestMapping("/resume")
public class ResumeController {

    @Autowired
    private ResumeService resumeService;
    
    @Autowired
    private UserService userService;
    
    /**
     * View demo resume without login
     */
    @GetMapping("/demo")
    public String viewDemoResume() {
        return "index"; // Return the original template
    }
    
    /**
     * View specific resume by ID
     */
    @GetMapping("/view/{id}")
    public String viewResume(@PathVariable String id, Model model) {
        Optional<Resume> resume = resumeService.getResumeById(id);
        
        if (resume.isPresent()) {
            model.addAttribute("resume", resume.get());
            model.addAttribute("viewMode", true);
            return "index"; // Use the same template but with different data
        } else {
            return "redirect:/"; // Redirect to home if resume not found
        }
    }
    
    /**
     * Edit specific resume by ID (requires authentication)
     */
    @GetMapping("/edit/{id}")
    public String editResume(@PathVariable String id, Model model) {
        // Get current authenticated user
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();
        Optional<User> userOpt = userService.findByUsername(username);
        
        if (userOpt.isEmpty()) {
            return "redirect:/login";
        }
        
        User user = userOpt.get();
        
        Optional<Resume> resume = resumeService.getResumeById(id);
        
        if (resume.isPresent() && resume.get().getUserId().equals(user.getId())) {
            model.addAttribute("resume", resume.get());
            model.addAttribute("editMode", true);
            return "index"; // Use the same template but with edit mode enabled
        } else {
            return "redirect:/dashboard"; // Redirect to dashboard if resume not found or not owned by user
        }
    }
    
    /**
     * Create new resume page
     */
    @GetMapping("/create")
    public String createResumePage(Model model) {
        // Get current authenticated user
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();
        Optional<User> userOpt = userService.findByUsername(username);
        
        if (userOpt.isEmpty()) {
            return "redirect:/login";
        }
        
        User user = userOpt.get();
        
        model.addAttribute("editMode", true);
        model.addAttribute("newResume", true);
        return "index"; // Use the same template but with create mode enabled
    }
    
    /**
     * REST API endpoints for resume management
     */
    @RestController
    @RequestMapping("/api/resumes")
    public static class ResumeRestController {
        
        @Autowired
        private ResumeService resumeService;
        
        @Autowired
        private UserService userService;
        
        /**
         * Get all resumes for the authenticated user
         */
        @GetMapping
        public ResponseEntity<?> getAllResumes() {
            // Get current authenticated user
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String username = auth.getName();
        Optional<User> userOpt = userService.findByUsername(username);
        
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        
        User user = userOpt.get();
            
        List<Resume> resumes = resumeService.getUserResumes(user.getId());
            Map<String, Object> response = new HashMap<>();
            response.put("resumes", resumes);
            
            return ResponseEntity.ok(response);
        }
        
        /**
         * Get a specific resume
         */
        @GetMapping("/{id}")
        public ResponseEntity<?> getResume(@PathVariable String id) {
            // Get current authenticated user
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String username = auth.getName();
        Optional<User> userOpt = userService.findByUsername(username);
        
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        
        User user = userOpt.get();
        
        Optional<Resume> resume = resumeService.getResumeById(id);
        
        if (resume.isPresent()) {
            // Check if the resume belongs to the authenticated user
            if (resume.get().getUserId().equals(user.getId())) {
                return ResponseEntity.ok(resume.get());
            } else {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }
        } else {
            return ResponseEntity.notFound().build();
        }
        }
        
        /**
         * Create a new resume
         */
        @PostMapping
        public ResponseEntity<?> createResume(@RequestBody Map<String, Object> payload) {
            // Get current authenticated user
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String username = auth.getName();
        Optional<User> userOpt = userService.findByUsername(username);
        
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        
        User user = userOpt.get();
        
        String title = (String) payload.getOrDefault("title", "Untitled Resume");
        
        // Create a copy of the default template with the user's info
        Resume newResume = resumeService.createResume(user.getId(), title);
        
        return ResponseEntity.status(HttpStatus.CREATED).body(newResume);
        }
        
        /**
         * Update a resume
         */
        @PutMapping("/{id}")
        public ResponseEntity<?> updateResume(@PathVariable String id, @RequestBody Resume updatedResume) {
            // Get current authenticated user
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String username = auth.getName();
        Optional<User> userOpt = userService.findByUsername(username);
        
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        
        User user = userOpt.get();
        
            Optional<Resume> existingResume = resumeService.getResumeById(id);
            
            if (existingResume.isPresent()) {
                // Check if the resume belongs to the authenticated user
                if (existingResume.get().getUserId().equals(user.getId())) {
                    updatedResume.setId(id);
                    updatedResume.setUserId(user.getId()); // Ensure user ID doesn't change
                    Resume saved = resumeService.updateResume(updatedResume);
                    return ResponseEntity.ok(saved);
                } else {
                    return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
                }
            } else {
                return ResponseEntity.notFound().build();
            }
        }
        
        /**
         * Update a section of a resume
         */
        @PatchMapping("/{id}/section/{section}")
        public ResponseEntity<?> updateResumeSection(@PathVariable String id, 
                                                   @PathVariable String section,
                                                   @RequestBody Map<String, Object> content) {
            // Get current authenticated user
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String username = auth.getName();
        Optional<User> userOpt = userService.findByUsername(username);
        
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        
        User user = userOpt.get();
        
        Optional<Resume> existingResume = resumeService.getResumeById(id);
        
        if (existingResume.isPresent()) {
            // Check if the resume belongs to the authenticated user
            if (existingResume.get().getUserId().equals(user.getId())) {
                // The updateSection method does not exist in ResumeService, so return not implemented
                return ResponseEntity.status(HttpStatus.NOT_IMPLEMENTED).body("Update section not implemented");
            } else {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }
        } else {
            return ResponseEntity.notFound().build();
        }
        }
        
        /**
         * Delete a resume
         */
        @DeleteMapping("/{id}")
        public ResponseEntity<?> deleteResume(@PathVariable String id) {
            // Get current authenticated user
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String username = auth.getName();
        Optional<User> userOpt = userService.findByUsername(username);
        
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        
        User user = userOpt.get();
        
        Optional<Resume> existingResume = resumeService.getResumeById(id);
        
        if (existingResume.isPresent()) {
            // Check if the resume belongs to the authenticated user
            if (existingResume.get().getUserId().equals(user.getId())) {
                resumeService.deleteResume(id);
                return ResponseEntity.ok().build();
            } else {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }
        } else {
            return ResponseEntity.notFound().build();
        }
        }
    }
}