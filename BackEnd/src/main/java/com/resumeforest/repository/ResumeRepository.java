package com.resumeforest.repository;

import com.resumeforest.model.Resume;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ResumeRepository extends MongoRepository<Resume, String> {
    List<Resume> findByUserId(String userId);
    List<Resume> findByIsPublicTrue();
    Optional<Resume> findByUserIdAndResumeName(String userId, String resumeName);
}