package org.example.ai_resume_builder;

import org.example.ai_resume_builder.service.ResumeService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.io.IOException;

@SpringBootTest
class AiResumeBuilderApplicationTests {

    @Autowired
    private ResumeService resumeService;
    @Test
    void contextLoads() throws IOException {

        resumeService.generateResumeResponse("My name is Adarsh Rai. I am a computer science student passionate about backend development. I have experience with Java, Spring Boot, and React, and I’ve built AI-based projects like a resume builder.\n ");
    }

}
