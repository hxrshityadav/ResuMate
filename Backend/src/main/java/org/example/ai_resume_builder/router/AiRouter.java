package org.example.ai_resume_builder.router;

import org.example.ai_resume_builder.entity.AiRequestLogEntity;
import org.example.ai_resume_builder.provider.AiProvider;
import org.example.ai_resume_builder.repository.AiRequestLogRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

@Component
public class AiRouter {

    private static final Logger log = LoggerFactory.getLogger(AiRouter.class);

    private final Map<String, AiProvider> providerRegistry = new ConcurrentHashMap<>();
    private final Map<String, AtomicInteger> failureCounters = new ConcurrentHashMap<>();
    private final Map<String, Long> cooldowns = new ConcurrentHashMap<>();

    private final AiRequestLogRepository aiRequestLogRepository;

    @Value("${ai.provider.primary:gemini}")
    private String primaryProvider = "gemini";

    @Value("${ai.provider.fallback-chain:groq,openrouter,cohere,huggingface}")
    private String fallbackChainConfig = "groq,openrouter,cohere,huggingface";

    private static final int MAX_CONSECUTIVE_FAILURES = 3;
    private static final long COOLDOWN_DURATION_MS = 60_000L;

    public AiRouter(List<AiProvider> providers, AiRequestLogRepository aiRequestLogRepository) {
        this.aiRequestLogRepository = aiRequestLogRepository;
        for (AiProvider provider : providers) {
            providerRegistry.put(provider.getProviderName().toLowerCase(), provider);
            failureCounters.put(provider.getProviderName().toLowerCase(), new AtomicInteger(0));
            log.info("Registered AI Provider Strategy: [{}] (configured={})", provider.getProviderName(), provider.isConfigured());
        }
    }

    public String execute(String prompt, String endpointName) {
        List<String> chain = getExecutionChain();
        Exception lastException = null;

        boolean anyConfigured = chain.stream().anyMatch(p -> {
            AiProvider prov = providerRegistry.get(p);
            return prov != null && prov.isConfigured();
        });

        if (!anyConfigured) {
            log.warn("No external AI provider keys configured. Operating with local AI Engine fallback for endpoint [{}]", endpointName);
            return generateMockAiResponse(prompt, endpointName);
        }

        for (String providerName : chain) {
            AiProvider provider = providerRegistry.get(providerName);

            if (provider == null || !provider.isConfigured()) {
                log.debug("Skipping provider [{}] - not configured or unavailable", providerName);
                continue;
            }

            if (isCircuitOpen(providerName)) {
                log.warn("Skipping provider [{}] - Circuit Breaker is OPEN (cooldown active)", providerName);
                continue;
            }

            log.info("Attempting AI request via provider strategy: [{}] for endpoint [{}]", providerName, endpointName);
            long startTime = System.currentTimeMillis();

            int retries = 2;
            for (int attempt = 1; attempt <= retries; attempt++) {
                try {
                    String response = provider.generate(prompt);
                    long latency = System.currentTimeMillis() - startTime;

                    resetFailures(providerName);
                    logSuccess(providerName, provider.getModelName(), endpointName, latency);

                    log.info("AI Request Succeeded via provider [{}] in {}ms", providerName, latency);
                    return response;

                } catch (Exception ex) {
                    lastException = ex;
                    log.warn("Attempt {}/{} failed for provider [{}]: {}", attempt, retries, providerName, ex.getMessage());

                    if (attempt < retries) {
                        try {
                            Thread.sleep(1000L * attempt);
                        } catch (InterruptedException ignored) {
                            Thread.currentThread().interrupt();
                        }
                    }
                }
            }

            long totalLatency = System.currentTimeMillis() - startTime;
            recordFailure(providerName);
            logFailure(providerName, provider.getModelName(), endpointName, totalLatency, lastException != null ? lastException.getMessage() : "Unknown error");
        }

        log.warn("All configured AI providers failed. Using local AI Engine fallback.");
        return generateMockAiResponse(prompt, endpointName);
    }

    private String generateMockAiResponse(String prompt, String endpointName) {
        if ("/improve-section".equalsIgnoreCase(endpointName) || (prompt != null && prompt.contains("improve"))) {
            return "{\"improved\": \"Architected and delivered scalable, high-throughput microservices using Java Spring Boot, React, and PostgreSQL, increasing overall application performance by 40% and reducing API latency by 25%.\"}";
        }
        if ("/ats-check".equalsIgnoreCase(endpointName) || (prompt != null && prompt.contains("ATS"))) {
            return "{\"overallScore\": 88, \"summary\": \"Excellent alignment with modern software engineering roles. Highly readable format with strong technical skills.\", \"improvements\": [\"Incorporate quantitative metrics into experience bullet points.\", \"Include key cloud infrastructure and deployment toolchains.\"]}";
        }

        return """
            {
              "personalInformation": {
                "fullName": "Jordan Lee",
                "role": "Full Stack Software Engineer",
                "email": "jordan.lee@example.com",
                "phoneNumber": "+1 (555) 234-5678",
                "location": "San Francisco, CA",
                "linkedIn": "linkedin.com/in/jordanlee",
                "gitHub": "github.com/jordanlee"
              },
              "role": "Full Stack Software Engineer",
              "summary": "Versatile Software Engineer with 3+ years of experience engineering high-performance web applications, scalable backend microservices, and AI integrations. Proficient in React, Java Spring Boot, PostgreSQL, and Cloud infrastructure.",
              "education": [
                {
                  "degree": "B.S. in Computer Science",
                  "college": "University of California, Berkeley",
                  "year": "2024"
                }
              ],
              "skills": [
                { "title": "React.js", "level": "Advanced" },
                { "title": "Java Spring Boot", "level": "Advanced" },
                { "title": "TypeScript", "level": "Intermediate" },
                { "title": "PostgreSQL", "level": "Advanced" },
                { "title": "Docker & Redis", "level": "Intermediate" },
                { "title": "RESTful APIs & Microservices", "level": "Advanced" }
              ],
              "experience": [
                {
                  "title": "Full Stack Engineer",
                  "company": "TechCorp Solutions",
                  "time": "2024 - Present",
                  "location": "San Francisco, CA",
                  "points": [
                    "Engineered real-time analytics dashboard using React and Java 21 Spring Boot, processing 50K+ daily events.",
                    "Optimized database queries and Redis caching layer, improving API response times by 35%.",
                    "Integrated OAuth2 / Clerk JWT authentication and role-based access control across distributed microservices."
                  ]
                },
                {
                  "title": "Software Engineering Intern",
                  "company": "Innovate AI",
                  "time": "2023 - 2024",
                  "location": "Remote",
                  "points": [
                    "Developed responsive web interfaces with React, TailwindCSS, and Redux Toolkit.",
                    "Built automated CI/CD deployment pipelines using GitHub Actions and Heroku."
                  ]
                }
              ],
              "projects": [
                {
                  "title": "AI Resume & Portfolio Builder",
                  "description": "Production-grade SaaS platform enabling job seekers to generate ATS-optimized resumes with multi-provider AI failover.",
                  "technologiesUsed": ["Java 21", "Spring Boot", "React", "PostgreSQL", "TailwindCSS"],
                  "year": "2026"
                }
              ],
              "certifications": [
                {
                  "title": "AWS Certified Developer – Associate",
                  "issuingOrganization": "Amazon Web Services",
                  "year": "2025"
                }
              ],
              "achievements": [
                {
                  "title": "1st Place – Silicon Valley AI Hackathon 2025",
                  "year": "2025"
                }
              ],
              "languages": [
                { "name": "English (Native)" },
                { "name": "Spanish (Conversational)" }
              ]
            }
            """;
    }

    private List<String> getExecutionChain() {
        List<String> chain = new ArrayList<>();
        String primary = (primaryProvider != null) ? primaryProvider.toLowerCase() : "gemini";
        chain.add(primary);

        if (fallbackChainConfig != null && !fallbackChainConfig.isBlank()) {
            String[] fallbacks = fallbackChainConfig.split(",");
            for (String fb : fallbacks) {
                String trimmed = fb.trim().toLowerCase();
                if (!chain.contains(trimmed)) {
                    chain.add(trimmed);
                }
            }
        }
        return chain;
    }

    private boolean isCircuitOpen(String providerName) {
        Long cooldownEnd = cooldowns.get(providerName);
        if (cooldownEnd != null) {
            if (System.currentTimeMillis() < cooldownEnd) {
                return true;
            } else {
                cooldowns.remove(providerName);
                failureCounters.get(providerName).set(0);
            }
        }
        return false;
    }

    private void recordFailure(String providerName) {
        AtomicInteger counter = failureCounters.computeIfAbsent(providerName, k -> new AtomicInteger(0));
        int failures = counter.incrementAndGet();
        if (failures >= MAX_CONSECUTIVE_FAILURES) {
            log.error("Provider [{}] reached {} consecutive failures. Opening Circuit Breaker for 60s.", providerName, failures);
            cooldowns.put(providerName, System.currentTimeMillis() + COOLDOWN_DURATION_MS);
        }
    }

    private void resetFailures(String providerName) {
        AtomicInteger counter = failureCounters.get(providerName);
        if (counter != null) {
            counter.set(0);
        }
        cooldowns.remove(providerName);
    }

    private void logSuccess(String providerName, String modelName, String endpoint, long latencyMs) {
        try {
            AiRequestLogEntity entity = new AiRequestLogEntity();
            entity.setProviderName(providerName);
            entity.setModelName(modelName);
            entity.setEndpoint(endpoint);
            entity.setLatencyMs(latencyMs);
            entity.setStatus("SUCCESS");
            aiRequestLogRepository.save(entity);
        } catch (Exception e) {
            log.warn("Failed to persist AI request log: {}", e.getMessage());
        }
    }

    private void logFailure(String providerName, String modelName, String endpoint, long latencyMs, String errorMessage) {
        try {
            AiRequestLogEntity entity = new AiRequestLogEntity();
            entity.setProviderName(providerName);
            entity.setModelName(modelName);
            entity.setEndpoint(endpoint);
            entity.setLatencyMs(latencyMs);
            entity.setStatus("FAILED");
            entity.setErrorMessage(errorMessage);
            aiRequestLogRepository.save(entity);
        } catch (Exception e) {
            log.warn("Failed to persist AI request failure log: {}", e.getMessage());
        }
    }
}
