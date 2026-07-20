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
public class OpenRouterProvider implements AiProvider {

    @Value("${ai.openrouter.key:}")
    private String apiKey;

    @Value("${ai.openrouter.url:https://openrouter.ai/api/v1/chat/completions}")
    private String url;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper mapper = new ObjectMapper();
    private final AtomicBoolean healthy = new AtomicBoolean(true);

    @Override
    public String getProviderName() {
        return "openrouter";
    }

    @Override
    public String getModelName() {
        return "google/gemini-2.0-flash-001";
    }

    @Override
    public boolean isConfigured() {
        return apiKey != null && !apiKey.isBlank();
    }

    @Override
    public boolean isHealthy() {
        return healthy.get();
    }

    @Override
    public String generate(String prompt) throws Exception {
        if (!isConfigured()) {
            throw new IllegalStateException("OpenRouter API key is not configured.");
        }

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(apiKey);

        Map<String, Object> body = Map.of(
                "model", getModelName(),
                "messages", List.of(Map.of("role", "user", "content", prompt))
        );

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);
        String rawResponse = restTemplate.postForObject(url, entity, String.class);

        Map<?, ?> root = mapper.readValue(rawResponse, Map.class);
        List<?> choices = (List<?>) root.get("choices");
        if (choices == null || choices.isEmpty()) {
            throw new RuntimeException("OpenRouter returned empty choices");
        }

        Map<?, ?> firstChoice = (Map<?, ?>) choices.get(0);
        Map<?, ?> message = (Map<?, ?>) firstChoice.get("message");
        String text = message.get("content").toString();

        return text.replace("```json", "").replace("```", "").trim();
    }
}
