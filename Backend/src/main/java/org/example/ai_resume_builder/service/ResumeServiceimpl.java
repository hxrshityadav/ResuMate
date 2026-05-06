package org.example.ai_resume_builder.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@Service
public class ResumeServiceimpl implements ResumeService {

    @Value("${gemini.api.key}")
    private String apiKey;

    @Value("${gemini.url}")
    private String url;

    private final ObjectMapper mapper = new ObjectMapper();

    /**
     * Call Gemini with up to 4 retries on transient errors (429 rate limit, 503 overload, connection resets).
     * Backs off: 15s → 30s → 60s for 429; 2s → 4s → 8s for 5xx/connection errors.
     */
    private String callGemini(Map<String, Object> body) throws Exception {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);
        RestTemplate restTemplate = new RestTemplate();

        int maxAttempts = 4;
        Exception lastEx = null;
        for (int attempt = 1; attempt <= maxAttempts; attempt++) {
            try {
                return restTemplate.postForObject(url + "?key=" + apiKey, entity, String.class);
            } catch (HttpClientErrorException e) {
                if (e.getStatusCode().value() == 429) {
                    // Rate limited — back off longer before retrying
                    lastEx = e;
                    if (attempt < maxAttempts) Thread.sleep(15000L * attempt);
                } else {
                    throw e; // 4xx other than 429 are not retryable
                }
            } catch (HttpServerErrorException e) {
                // Retry on 5xx (503 overload, 500, etc.)
                lastEx = e;
                if (attempt < maxAttempts) Thread.sleep(2000L * attempt);
            } catch (Exception e) {
                // Retry on connection errors (reset, timeout)
                String msg = e.getMessage() != null ? e.getMessage() : "";
                if (msg.contains("connection") || msg.contains("reset") || msg.contains("timeout")) {
                    lastEx = e;
                    if (attempt < maxAttempts) Thread.sleep(2000L * attempt);
                } else {
                    throw e; // non-transient error, fail fast
                }
            }
        }
        throw lastEx != null ? lastEx : new RuntimeException("Gemini API unreachable");
    }

    @Override
    public Map<String, Object> generateResumeResponse(String userResumeDescription) {

        try {

            String prompt =
                    "Generate ONLY valid JSON professional IT resume.\n" +
                            "Return ONLY JSON. No markdown. No explanation.\n" +
                            "Never return null.\n" +
                            "Never return empty objects.\n" +
                            "If information is missing, create realistic professional data.\n\n" +

                            "Use EXACT structure:\n" +

                            "{\n" +
                            "  \"personalInformation\": {\n" +
                            "    \"fullName\":\"\",\n" +
                            "    \"email\":\"\",\n" +
                            "    \"phoneNumber\":\"\",\n" +
                            "    \"location\":\"\",\n" +
                            "    \"linkedIn\":\"\",\n" +
                            "    \"gitHub\":\"\",\n" +
                            "    \"portfolio\":\"\"\n" +
                            "  },\n" +

                            "  \"summary\":\"\",\n" +

                            "  \"skills\":[\n" +
                            "    {\"title\":\"Java\",\"level\":\"Advanced\"}\n" +
                            "  ],\n" +

                            "  \"experience\":[\n" +
                            "    {\n" +
                            "      \"jobTitle\":\"Software Developer Intern\",\n" +
                            "      \"company\":\"ABC Tech\",\n" +
                            "      \"location\":\"Remote\",\n" +
                            "      \"duration\":\"Jan 2025 - Present\",\n" +
                            "      \"responsibility\":\"Developed web applications\"\n" +
                            "    }\n" +
                            "  ],\n" +

                            "  \"education\":[\n" +
                            "    {\n" +
                            "      \"degree\":\"B.Tech Computer Science\",\n" +
                            "      \"university\":\"XYZ University\",\n" +
                            "      \"location\":\"India\",\n" +
                            "      \"graduationYear\":\"2026\"\n" +
                            "    }\n" +
                            "  ],\n" +

                            "  \"certifications\":[\n" +
                            "    {\n" +
                            "      \"title\":\"Java Certification\",\n" +
                            "      \"issuingOrganization\":\"Oracle\",\n" +
                            "      \"year\":\"2025\"\n" +
                            "    }\n" +
                            "  ],\n" +

                            "  \"projects\":[\n" +
                            "    {\n" +
                            "      \"title\":\"AI Resume Builder\",\n" +
                            "      \"description\":\"Built AI tool for resume generation\",\n" +
                            "      \"technologiesUsed\":[\"React\",\"Spring Boot\",\"Gemini API\"],\n" +
                            "      \"githubLink\":\"\"\n" +
                            "    }\n" +
                            "  ],\n" +

                            "  \"achievements\":[\n" +
                            "    {\n" +
                            "      \"title\":\"Solved 300+ DSA Problems\",\n" +
                            "      \"year\":\"2025\",\n" +
                            "      \"extraInformation\":\"Strong problem solving skills\"\n" +
                            "    }\n" +
                            "  ],\n" +

                            "  \"languages\":[\n" +
                            "    {\"name\":\"English\"},\n" +
                            "    {\"name\":\"Hindi\"}\n" +
                            "  ],\n" +

                            "  \"interests\":[\n" +
                            "    {\"name\":\"Software Development\"},\n" +
                            "    {\"name\":\"Artificial Intelligence\"}\n" +
                            "  ]\n" +
                            "}\n\n" +

                            "Important Rules:\n" +
                            "- skills must be objects with title and level.\n" +
                            "- languages must be objects with name.\n" +
                            "- interests must be objects with name.\n" +
                            "- achievements must be complete objects.\n" +
                            "- technologiesUsed must always be string array.\n" +
                            "- Use user's actual data wherever possible.\n\n" +

                            "User Description:\n" +
                            userResumeDescription;

            Map<String, Object> body = Map.of(
                    "contents", List.of(Map.of("parts", List.of(Map.of("text", prompt))))
            );

            String response = callGemini(body);

            Map<String, Object> root = mapper.readValue(response, Map.class);
            List<?> candidates = (List<?>) root.get("candidates");
            Map<?, ?> firstCandidate = (Map<?, ?>) candidates.get(0);
            Map<?, ?> content = (Map<?, ?>) firstCandidate.get("content");
            List<?> parts = (List<?>) content.get("parts");
            String text = ((Map<?, ?>) parts.get(0)).get("text").toString()
                    .replace("```json", "").replace("```", "").trim();

            return mapper.readValue(text, Map.class);

        } catch (Exception e) {
            return Map.of("error", e.getMessage());
        }
    }

    @Override
    public Map<String, Object> improveSection(String sectionType, String content) {
        try {
            String prompt;

            if ("summary".equals(sectionType)) {
                prompt = "You are a professional resume writer. Improve this professional summary for a resume. " +
                        "Make it compelling, ATS-friendly, concise (2-3 sentences), and impactful. " +
                        "Return ONLY valid JSON. No markdown. No explanation.\n\n" +
                        "Return ONLY this JSON: {\"improved\": \"improved summary text here\"}\n\n" +
                        "Current summary: " + content;

            } else if ("experience".equals(sectionType)) {
                prompt = "You are a professional resume writer. For this work experience, " +
                        "create 4-5 strong resume bullet points. Use action verbs (Developed, Implemented, Optimized, etc.) " +
                        "and quantify achievements with metrics where possible. " +
                        "Return ONLY valid JSON. No markdown. No explanation.\n\n" +
                        "Return ONLY this JSON: {\"bullets\": [\"bullet 1\", \"bullet 2\", \"bullet 3\", \"bullet 4\"]}\n\n" +
                        "Experience data: " + content;

            } else if ("project".equals(sectionType)) {
                prompt = "You are a professional resume writer. For this project, " +
                        "create 3 strong resume bullet points highlighting technical achievements, " +
                        "technologies used, and impact. Use action verbs. " +
                        "Return ONLY valid JSON. No markdown. No explanation.\n\n" +
                        "Return ONLY this JSON: {\"bullets\": [\"bullet 1\", \"bullet 2\", \"bullet 3\"]}\n\n" +
                        "Project data: " + content;

            } else {
                return Map.of("error", "Unknown section type: " + sectionType);
            }

            Map<String, Object> body = Map.of(
                    "contents", List.of(Map.of("parts", List.of(Map.of("text", prompt))))
            );

            String response = callGemini(body);

            Map<String, Object> root = mapper.readValue(response, Map.class);
            List<?> candidates = (List<?>) root.get("candidates");
            Map<?, ?> firstCandidate = (Map<?, ?>) candidates.get(0);
            Map<?, ?> c = (Map<?, ?>) firstCandidate.get("content");
            List<?> parts = (List<?>) c.get("parts");
            String text = ((Map<?, ?>) parts.get(0)).get("text").toString()
                    .replace("```json", "").replace("```", "").trim();

            return mapper.readValue(text, Map.class);

        } catch (Exception e) {
            return Map.of("error", e.getMessage());
        }
    }

    @Override
    public Map<String, Object> checkAtsScore(String resumeText, String jobDescription) {
        try {
            String jobDescSection = (jobDescription != null && !jobDescription.isBlank())
                    ? "Job Description to match against:\n" + jobDescription + "\n\n"
                    : "No specific job description provided. Evaluate the resume for general ATS best practices.\n\n";

            String prompt =
                    "You are an expert ATS (Applicant Tracking System) analyzer.\n" +
                    "Analyze the following resume and return ONLY valid JSON. No markdown. No explanation.\n\n" +

                    jobDescSection +

                    "Resume Text:\n" + resumeText + "\n\n" +

                    "Return ONLY this JSON structure:\n" +
                    "{\n" +
                    "  \"overallScore\": 78,\n" +
                    "  \"scoreBreakdown\": {\n" +
                    "    \"keywordsMatch\": 80,\n" +
                    "    \"formatting\": 85,\n" +
                    "    \"skillsRelevance\": 75,\n" +
                    "    \"experienceClarity\": 70,\n" +
                    "    \"educationPresence\": 90\n" +
                    "  },\n" +
                    "  \"strengths\": [\"Clear contact information\", \"Strong action verbs used\"],\n" +
                    "  \"improvements\": [\"Add more relevant keywords\", \"Quantify achievements with numbers\"],\n" +
                    "  \"missingKeywords\": [\"Docker\", \"CI/CD\", \"Agile\"],\n" +
                    "  \"detectedKeywords\": [\"Java\", \"Spring Boot\", \"React\"],\n" +
                    "  \"summary\": \"Your resume scores 78/100. It is well-structured but missing some key industry terms.\"\n" +
                    "}\n\n" +

                    "Scoring rules:\n" +
                    "- overallScore: weighted average of all breakdown scores (0-100)\n" +
                    "- keywordsMatch: how well resume keywords match the job description (or industry norms if no JD)\n" +
                    "- formatting: clean structure, bullet points, proper sections present\n" +
                    "- skillsRelevance: how relevant and strong the skills section is\n" +
                    "- experienceClarity: clear job titles, companies, dates, quantified achievements\n" +
                    "- educationPresence: degree, institution, graduation year present\n" +
                    "- strengths: list of 3-5 specific things done well\n" +
                    "- improvements: list of 3-5 actionable suggestions\n" +
                    "- missingKeywords: list of important keywords missing from the resume\n" +
                    "- detectedKeywords: list of strong keywords already present\n" +
                    "- summary: one paragraph summary of the ATS analysis";

            Map<String, Object> body = Map.of(
                    "contents", List.of(Map.of("parts", List.of(Map.of("text", prompt))))
            );

            String response = callGemini(body);

            Map<String, Object> root = mapper.readValue(response, Map.class);
            List<?> candidates = (List<?>) root.get("candidates");
            Map<?, ?> firstCandidate = (Map<?, ?>) candidates.get(0);
            Map<?, ?> content = (Map<?, ?>) firstCandidate.get("content");
            List<?> parts = (List<?>) content.get("parts");
            String text = ((Map<?, ?>) parts.get(0)).get("text").toString()
                    .replace("```json", "").replace("```", "").trim();

            return mapper.readValue(text, Map.class);

        } catch (Exception e) {
            return Map.of("error", e.getMessage());
        }
    }

    @Override
    public Map<String, Object> generateTargetedResume(String resumeText, String jobDescription, String targetRole) {
        try {
            String prompt =
                "You are an expert resume writer and ATS specialist.\n" +
                "Rewrite the candidate's existing resume to be perfectly tailored for the target job role and job description below.\n" +
                "Rules:\n" +
                "- Use keywords and phrases directly from the job description.\n" +
                "- Restructure bullet points to highlight relevant achievements and skills.\n" +
                "- Keep all factual information (company names, dates, degrees) intact — do NOT invent new jobs.\n" +
                "- Optimize the professional summary for the target role.\n" +
                "- Reorder and emphasize skills that match the job description.\n" +
                "- Return ONLY valid JSON. No markdown. No explanation.\n\n" +

                "Target Job Role: " + targetRole + "\n\n" +
                "Job Description:\n" + jobDescription + "\n\n" +
                "Existing Resume Text:\n" + resumeText + "\n\n" +

                "Return ONLY this JSON structure:\n" +
                "{\n" +
                "  \"personalInformation\": {\n" +
                "    \"fullName\":\"\", \"email\":\"\", \"phoneNumber\":\"\",\n" +
                "    \"location\":\"\", \"linkedIn\":\"\", \"gitHub\":\"\", \"portfolio\":\"\"\n" +
                "  },\n" +
                "  \"summary\":\"\",\n" +
                "  \"skills\":[{\"title\":\"Java\",\"level\":\"Advanced\"}],\n" +
                "  \"experience\":[{\n" +
                "    \"jobTitle\":\"\", \"company\":\"\", \"location\":\"\",\n" +
                "    \"duration\":\"\", \"responsibility\":\"\"\n" +
                "  }],\n" +
                "  \"education\":[{\n" +
                "    \"degree\":\"\", \"university\":\"\", \"location\":\"\", \"graduationYear\":\"\"\n" +
                "  }],\n" +
                "  \"certifications\":[{\"title\":\"\",\"issuingOrganization\":\"\",\"year\":\"\"}],\n" +
                "  \"projects\":[{\"title\":\"\",\"description\":\"\",\"technologiesUsed\":[],\"githubLink\":\"\"}],\n" +
                "  \"achievements\":[{\"title\":\"\",\"year\":\"\",\"extraInformation\":\"\"}],\n" +
                "  \"languages\":[{\"name\":\"\"}],\n" +
                "  \"interests\":[{\"name\":\"\"}]\n" +
                "}";

            Map<String, Object> body = Map.of(
                    "contents", List.of(Map.of("parts", List.of(Map.of("text", prompt))))
            );

            String response = callGemini(body);

            Map<String, Object> root = mapper.readValue(response, Map.class);
            List<?> candidates = (List<?>) root.get("candidates");
            Map<?, ?> firstCandidate = (Map<?, ?>) candidates.get(0);
            Map<?, ?> content = (Map<?, ?>) firstCandidate.get("content");
            List<?> parts = (List<?>) content.get("parts");
            String text = ((Map<?, ?>) parts.get(0)).get("text").toString()
                    .replace("```json", "").replace("```", "").trim();

            return mapper.readValue(text, Map.class);

        } catch (Exception e) {
            return Map.of("error", e.getMessage());
        }
    }
}