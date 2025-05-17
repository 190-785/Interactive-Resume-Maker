package com.resumeforest.service;

import com.resumeforest.model.Resume;
import com.resumeforest.repository.ResumeRepository;
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

    public List<Resume> getUserResumes(String userId) {
        return resumeRepository.findByUserId(userId);
    }

    public List<Resume> getPublicResumes() {
        return resumeRepository.findByIsPublicTrue();
    }

    public Optional<Resume> getResumeById(String resumeId) {
        return resumeRepository.findById(resumeId);
    }

    public Resume updateResume(Resume resume) {
        return resumeRepository.save(resume);
    }

    public void deleteResume(String resumeId) {
        resumeRepository.deleteById(resumeId);
    }

    public Optional<Resume> getResumeByUserIdAndName(String userId, String resumeName) {
        return resumeRepository.findByUserIdAndResumeName(userId, resumeName);
    }
}