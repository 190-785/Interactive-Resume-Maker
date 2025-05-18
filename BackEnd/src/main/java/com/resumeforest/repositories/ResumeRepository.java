package com.resumeforest.repositories;

import com.resumeforest.models.Resume;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ResumeRepository extends MongoRepository<Resume, String> {
    List<Resume> findByUserId(String userId);
    Optional<Resume> findByUserIdAndResumeName(String userId, String resumeName);
    Optional<Resume> findByUserIdAndId(String userId, String id);
    List<Resume> findByIsPublicTrue();
}
