package com.resumeforest;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

@SpringBootApplication(scanBasePackages = "com.resumeforest")
@EnableMongoRepositories(basePackages = "com.resumeforest.repositories")
public class ResumeForestApplication {

    public static void main(String[] args) {
        SpringApplication.run(ResumeForestApplication.class, args);
    }
}