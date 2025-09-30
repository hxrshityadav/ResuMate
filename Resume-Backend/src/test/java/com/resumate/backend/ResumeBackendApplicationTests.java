package com.resumate.backend;

import com.fasterxml.jackson.datatype.jsr310.ser.DurationSerializer;
import com.resumate.backend.Service.ResumeService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.io.IOException;

@SpringBootTest
class ResumeBackendApplicationTests {

    @Autowired
    private ResumeService resumeService;

	@Test
	void contextLoads() throws IOException {
        resumeService.generateResumeResponse("I'm Harshit Yadav a final year CSE student with a strong background in Java and Spring Boot, seeking to leverage my skills in building scalable web applications.");
	}

}
