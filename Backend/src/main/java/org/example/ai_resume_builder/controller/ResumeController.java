package org.example.ai_resume_builder.controller;

import org.example.ai_resume_builder.AtsRequest;
import org.example.ai_resume_builder.ImproveSectionRequest;
import org.example.ai_resume_builder.ResumeRequest;
import org.example.ai_resume_builder.TargetResumeRequest;
import org.example.ai_resume_builder.service.ResumeService;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/v1/resume")
public class ResumeController {

    private final ResumeService resumeService;

    public ResumeController(ResumeService resumeService) {
        this.resumeService = resumeService;
    }

    @PostMapping("/generate")
    public Map<String, Object> generate(@RequestBody ResumeRequest request) {
        return resumeService.generateResumeResponse(
                request.userDescription()
        );
    }

    @PostMapping("/ats-check")
    public Map<String, Object> atsCheck(@RequestBody AtsRequest request) {
        return resumeService.checkAtsScore(
                request.resumeText(),
                request.jobDescription()
        );
    }

    @PostMapping("/improve-section")
    public Map<String, Object> improveSection(@RequestBody ImproveSectionRequest request) {
        return resumeService.improveSection(request.sectionType(), request.content());
    }

    @PostMapping("/target-resume")
    public Map<String, Object> targetResume(@RequestBody TargetResumeRequest request) {
        return resumeService.generateTargetedResume(
                request.resumeText(),
                request.jobDescription(),
                request.targetRole()
        );
    }
}