package com.resumeforest.controller;

import com.resumeforest.model.Resume;
import com.resumeforest.service.ResumeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.Optional;

@Controller
public class HomeController {

    @Autowired
    private ResumeService resumeService;

    @GetMapping("/")
    public String index() {
        return "index";
    }

    @GetMapping("/login")
    public String login() {
        return "login";
    }

    @GetMapping("/register")
    public String register() {
        return "register";
    }

    @GetMapping("/dashboard")
    public String dashboard() {
        return "dashboard";
    }

    @GetMapping("/view/{resumeId}")
    public String viewPublicResume(@PathVariable String resumeId, Model model) {
        Optional<Resume> resumeOpt = resumeService.getResumeById(resumeId);
        
        if (!resumeOpt.isPresent() || !resumeOpt.get().isPublic()) {
            return "redirect:/";
        }
        
        model.addAttribute("resume", resumeOpt.get());
        return "view-resume";
    }
}