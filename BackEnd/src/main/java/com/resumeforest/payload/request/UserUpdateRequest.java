package com.resumeforest.payload.request;

import javax.validation.constraints.Email;
import javax.validation.constraints.Size;

public class UserUpdateRequest {
    @Size(max = 100)
    private String fullName;

    @Size(max = 50)
    @Email
    private String email;
    
    @Size(max = 500)
    private String bio;

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
    
    public String getBio() {
        return bio;
    }
    
    public void setBio(String bio) {
        this.bio = bio;
    }
}
