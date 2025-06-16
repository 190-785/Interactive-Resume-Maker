package com.resumeforest.services;

import com.resumeforest.models.Resume;
import com.resumeforest.models.User;
import com.resumeforest.repositories.ResumeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class ResumeService {    @Autowired
    private ResumeRepository resumeRepository;
    
    @Autowired
    private UserService userService;

    public Resume createResume(String userId, String resumeName) {
        // Check if resume name already exists for this user
        if (resumeRepository.findByUserIdAndResumeName(userId, resumeName).isPresent()) {
            throw new RuntimeException("Resume with this name already exists");
        }
        
        Resume resume = new Resume(userId, resumeName);
        return resumeRepository.save(resume);
    }
    
    public Optional<Resume> getResumeById(String resumeId) {
        return resumeRepository.findById(resumeId);
    }
    
    public Optional<Resume> getResumeByUserIdAndId(String userId, String resumeId) {
        return resumeRepository.findByUserIdAndId(userId, resumeId);
    }
      public List<Resume> getResumesByUserId(String userId) {
        return resumeRepository.findByUserId(userId);
    }
    
    public List<Resume> getUserResumes(String userId) {
        return getResumesByUserId(userId);
    }
    
    public Resume updateResume(Resume resume) {
        return resumeRepository.save(resume);
    }
      public void deleteResume(String resumeId) {
        resumeRepository.deleteById(resumeId);
    }
      /**
     * Get all public resumes
     * @return List of public resumes
     */
    public List<Resume> getAllPublicResumes() {
        return resumeRepository.findByIsPublicTrue();
    }    /**
     * Get user's primary resume (first resume or create new one)
     */
    public Optional<Resume> getUserPrimaryResume(String username) {
        // First, get user ID from username
        Optional<User> user = userService.getUserByUsername(username);
        if (!user.isPresent()) {
            return Optional.empty();
        }
        
        String userId = user.get().getId();
        List<Resume> userResumes = getResumesByUserId(userId);
        if (!userResumes.isEmpty()) {
            return Optional.of(userResumes.get(0)); // Return first resume as primary
        }
        return Optional.empty();
    }    /**
     * Create or update user's primary resume
     */
    public Resume createOrUpdateUserPrimaryResume(String userId, Map<String, Object> resumeData) {
        List<Resume> userResumes = getResumesByUserId(userId);
        
        Resume resume;
        if (!userResumes.isEmpty()) {
            resume = userResumes.get(0); // Use first resume as primary
        } else {
            resume = new Resume(userId, "Primary Resume");
        }
        
        // Update resume fields from the map
        updateResumeFromData(resume, resumeData);
        
        return resumeRepository.save(resume);
    }

    /**
     * Update specific resume by ID
     */
    public Resume updateResume(String resumeId, Map<String, Object> resumeData) {
        Optional<Resume> existingResume = getResumeById(resumeId);
        if (!existingResume.isPresent()) {
            throw new RuntimeException("Resume not found");
        }
        
        Resume resume = existingResume.get();
        updateResumeFromData(resume, resumeData);
        
        return resumeRepository.save(resume);
    }    /**
     * Helper method to update resume fields from data map
     */
    @SuppressWarnings("unchecked")
    private void updateResumeFromData(Resume resume, Map<String, Object> data) {
        if (data.containsKey("aboutMe")) {
            resume.setAboutMe((String) data.get("aboutMe"));
        }
        if (data.containsKey("skills")) {
            if (data.get("skills") instanceof String) {
                resume.getSkills().put("content", (String) data.get("skills"));
            } else if (data.get("skills") instanceof Map) {
                resume.setSkills((Map<String, String>) data.get("skills"));
            }
        }
        if (data.containsKey("experience")) {
            if (data.get("experience") instanceof String) {
                resume.getExperience().put("content", (String) data.get("experience"));
            } else if (data.get("experience") instanceof Map) {
                resume.setExperience((Map<String, String>) data.get("experience"));
            }
        }
        if (data.containsKey("projects")) {
            if (data.get("projects") instanceof String) {
                resume.getProjects().put("content", (String) data.get("projects"));
            } else if (data.get("projects") instanceof Map) {
                resume.setProjects((Map<String, String>) data.get("projects"));
            }
        }
        if (data.containsKey("education")) {
            if (data.get("education") instanceof String) {
                resume.getEducation().put("content", (String) data.get("education"));
            } else if (data.get("education") instanceof Map) {
                resume.setEducation((Map<String, String>) data.get("education"));
            }
        }
        if (data.containsKey("resumeName")) {
            resume.setResumeName((String) data.get("resumeName"));
        }
        if (data.containsKey("isPublic")) {
            resume.setPublic((Boolean) data.get("isPublic"));
        }
    }
    /**
     * Get user's primary resume by userId (first resume or empty)
     */
    public Optional<Resume> getUserPrimaryResumeByUserId(String userId) {
        List<Resume> userResumes = getResumesByUserId(userId);
        if (!userResumes.isEmpty()) {
            return Optional.of(userResumes.get(0)); // Return first resume as primary
        }
        return Optional.empty();
    }
}
