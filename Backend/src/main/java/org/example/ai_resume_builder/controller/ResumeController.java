package org.example.ai_resume_builder.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.ai_resume_builder.AtsRequest;
import org.example.ai_resume_builder.ImproveSectionRequest;
import org.example.ai_resume_builder.ResumeRequest;
import org.example.ai_resume_builder.TargetResumeRequest;
import org.example.ai_resume_builder.dto.ApiResponse;
import org.example.ai_resume_builder.entity.UserEntity;
import org.example.ai_resume_builder.repository.UserRepository;
import org.example.ai_resume_builder.security.UserPrincipal;
import org.example.ai_resume_builder.service.ResumeService;
import org.example.ai_resume_builder.usage.RedisRateLimiterService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/resume")
@RequiredArgsConstructor
public class ResumeController {

    private final ResumeService resumeService;
    private final RedisRateLimiterService rateLimiterService;
    private final UserRepository userRepository;

    @PostMapping("/generate")
    public ApiResponse<Map<String, Object>> generate(
            @Valid @RequestBody ResumeRequest request,
            @AuthenticationPrincipal UserPrincipal principal) {

        UserEntity user = getUserFromPrincipal(principal);
        rateLimiterService.checkAndIncrementLimit(user, "generate");

        Map<String, Object> result = resumeService.generateResumeResponse(request.userDescription());
        return ApiResponse.success("Resume generated successfully", result);
    }

    @PostMapping("/ats-check")
    public ApiResponse<Map<String, Object>> atsCheck(
            @Valid @RequestBody AtsRequest request,
            @AuthenticationPrincipal UserPrincipal principal) {

        UserEntity user = getUserFromPrincipal(principal);
        rateLimiterService.checkAndIncrementLimit(user, "ats");

        Map<String, Object> result = resumeService.checkAtsScore(request.resumeText(), request.jobDescription());
        return ApiResponse.success("ATS score checked successfully", result);
    }

    @PostMapping("/improve-section")
    public ApiResponse<Map<String, Object>> improveSection(
            @Valid @RequestBody ImproveSectionRequest request,
            @AuthenticationPrincipal UserPrincipal principal) {

        UserEntity user = getUserFromPrincipal(principal);
        rateLimiterService.checkAndIncrementLimit(user, "improve");

        Map<String, Object> result = resumeService.improveSection(request.sectionType(), request.content());
        return ApiResponse.success("Section improved successfully", result);
    }

    @PostMapping("/target-resume")
    public ApiResponse<Map<String, Object>> targetResume(
            @Valid @RequestBody TargetResumeRequest request,
            @AuthenticationPrincipal UserPrincipal principal) {

        UserEntity user = getUserFromPrincipal(principal);
        rateLimiterService.checkAndIncrementLimit(user, "generate");

        Map<String, Object> result = resumeService.generateTargetedResume(
                request.resumeText(),
                request.jobDescription(),
                request.targetRole()
        );
        return ApiResponse.success("Targeted resume created successfully", result);
    }

    private UserEntity getUserFromPrincipal(UserPrincipal principal) {
        if (principal == null) return null;
        return userRepository.findById(principal.getId()).orElse(null);
    }
}