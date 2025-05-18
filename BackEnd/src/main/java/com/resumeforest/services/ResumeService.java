package com.resumeforest.services;

import com.resumeforest.models.Resume;
import com.resumeforest.repositories.ResumeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ResumeService {

    @Autowired
    private ResumeRepository resumeRepository;

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
    }
}
