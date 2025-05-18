package com.resumeforest.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.HashMap;
import java.util.Map;

@Document(collection = "resumes")
public class Resume {
    
    @Id
    private String id;
    private String userId;
    private String resumeName;
    private String aboutMe;
    private Map<String, String> skills = new HashMap<>();
    private Map<String, String> experience = new HashMap<>();
    private Map<String, String> projects = new HashMap<>();    private Map<String, String> education = new HashMap<>();
    private Map<String, String> mediaUrls = new HashMap<>();
    private boolean isPublic = false;

    // Default constructor
    public Resume() {
    }

    // Constructor with basic fields
    public Resume(String userId, String resumeName) {
        this.userId = userId;
        this.resumeName = resumeName;
    }

    // Getters and setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getResumeName() {
        return resumeName;
    }

    public void setResumeName(String resumeName) {
        this.resumeName = resumeName;
    }

    public String getAboutMe() {
        return aboutMe;
    }

    public void setAboutMe(String aboutMe) {
        this.aboutMe = aboutMe;
    }

    public Map<String, String> getSkills() {
        return skills;
    }

    public void setSkills(Map<String, String> skills) {
        this.skills = skills;
    }

    public Map<String, String> getExperience() {
        return experience;
    }

    public void setExperience(Map<String, String> experience) {
        this.experience = experience;
    }

    public Map<String, String> getProjects() {
        return projects;
    }

    public void setProjects(Map<String, String> projects) {
        this.projects = projects;
    }

    public Map<String, String> getEducation() {
        return education;
    }

    public void setEducation(Map<String, String> education) {
        this.education = education;
    }

    public Map<String, String> getMediaUrls() {
        return mediaUrls;
    }    public void setMediaUrls(Map<String, String> mediaUrls) {
        this.mediaUrls = mediaUrls;
    }
    
    public boolean isPublic() {
        return isPublic;
    }

    public void setPublic(boolean isPublic) {
        this.isPublic = isPublic;
    }
}
