package org.example.ai_resume_builder.provider;

public interface AiProvider {

    /**
     * Unique identifier for the provider (e.g., "gemini", "groq", "openrouter", "cohere", "huggingface").
     */
    String getProviderName();

    /**
     * Model name being used by default for this provider strategy.
     */
    String getModelName();

    /**
     * Checks if provider is enabled and configured with an API key.
     */
    boolean isConfigured();

    /**
     * Check current health status of provider.
     */
    boolean isHealthy();

    /**
     * Executes prompt generation against the underlying AI service.
     *
     * @param prompt User or system structured prompt
     * @return Generated string response (expected JSON format)
     * @throws Exception when request fails or rate limit occurs
     */
    String generate(String prompt) throws Exception;
}
