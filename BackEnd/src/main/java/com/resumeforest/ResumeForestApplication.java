package com.resumeforest;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

@SpringBootApplication
@EnableMongoRepositories
public class ResumeForestApplication {

    public static void main(String[] args) {
        SpringApplication.run(ResumeForestApplication.class, args);
    }
}