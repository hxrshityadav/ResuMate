package org.example.ai_resume_builder.provider;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;
import java.util.concurrent.atomic.AtomicBoolean;

@Slf4j
@Component
public class GeminiProvider implements AiProvider {

    @Value("${ai.gemini.key:}")
    private String apiKey;

    @Value("${ai.gemini.url:https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent}")
    private String url;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper mapper = new ObjectMapper();
    private final AtomicBoolean healthy = new AtomicBoolean(true);

    @Override
    public String getProviderName() {
        return "gemini";
    }

    @Override
    public String getModelName() {
        return "gemini-flash-latest";
    }

    @Override
    public boolean isConfigured() {
        return apiKey != null && !apiKey.isBlank();
    }

    @Override
    public boolean isHealthy() {
        return healthy.get();
    }

    public void setHealthy(boolean state) {
        healthy.set(state);
    }

    @Override
    public String generate(String prompt) throws Exception {
        if (!isConfigured()) {
            throw new IllegalStateException("Gemini API key is not configured.");
        }

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, Object> body = Map.of(
                "contents", List.of(Map.of("parts", List.of(Map.of("text", prompt))))
        );

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);
        String fullUrl = url.contains("?") ? url + "&key=" + apiKey : url + "?key=" + apiKey;

        String rawResponse = restTemplate.postForObject(fullUrl, entity, String.class);

        Map<?, ?> root = mapper.readValue(rawResponse, Map.class);
        List<?> candidates = (List<?>) root.get("candidates");
        if (candidates == null || candidates.isEmpty()) {
            throw new RuntimeException("Gemini returned empty candidate list");
        }

        Map<?, ?> firstCandidate = (Map<?, ?>) candidates.get(0);
        Map<?, ?> content = (Map<?, ?>) firstCandidate.get("content");
        List<?> parts = (List<?>) content.get("parts");
        String text = ((Map<?, ?>) parts.get(0)).get("text").toString();

        return text.replace("```json", "").replace("```", "").trim();
    }
}
