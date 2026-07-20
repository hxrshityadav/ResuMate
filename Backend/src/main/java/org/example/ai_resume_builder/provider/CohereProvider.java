package org.example.ai_resume_builder.provider;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.Map;
import java.util.concurrent.atomic.AtomicBoolean;

@Slf4j
@Component
public class CohereProvider implements AiProvider {

    @Value("${ai.cohere.key:}")
    private String apiKey;

    @Value("${ai.cohere.url:https://api.cohere.com/v1/chat}")
    private String url;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper mapper = new ObjectMapper();
    private final AtomicBoolean healthy = new AtomicBoolean(true);

    @Override
    public String getProviderName() {
        return "cohere";
    }

    @Override
    public String getModelName() {
        return "command-r-plus";
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
            throw new IllegalStateException("Cohere API key is not configured.");
        }

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(apiKey);

        Map<String, Object> body = Map.of(
                "model", getModelName(),
                "message", prompt
        );

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);
        String rawResponse = restTemplate.postForObject(url, entity, String.class);

        Map<?, ?> root = mapper.readValue(rawResponse, Map.class);
        Object text = root.get("text");
        if (text == null) {
            throw new RuntimeException("Cohere returned null response");
        }

        return text.toString().replace("```json", "").replace("```", "").trim();
    }
}
