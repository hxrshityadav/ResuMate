package org.example.ai_resume_builder.service;

import java.util.Map;

public interface ResumeService {

    Map<String, Object> generateResumeResponse(String userResumeDescription);

    Map<String, Object> checkAtsScore(String resumeText, String jobDescription);

    Map<String, Object> improveSection(String sectionType, String content);

    Map<String, Object> generateTargetedResume(String resumeText, String jobDescription, String targetRole);
}
