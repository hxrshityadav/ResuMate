package org.example.ai_resume_builder.router;

import org.example.ai_resume_builder.provider.AiProvider;
import org.example.ai_resume_builder.repository.AiRequestLogRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class AiRouterTest {

    private AiProvider primaryProvider;
    private AiProvider fallbackProvider;
    private AiRequestLogRepository logRepository;
    private AiRouter aiRouter;

    @BeforeEach
    void setUp() {
        primaryProvider = mock(AiProvider.class);
        when(primaryProvider.getProviderName()).thenReturn("gemini");
        when(primaryProvider.getModelName()).thenReturn("gemini-flash-latest");
        when(primaryProvider.isConfigured()).thenReturn(true);

        fallbackProvider = mock(AiProvider.class);
        when(fallbackProvider.getProviderName()).thenReturn("groq");
        when(fallbackProvider.getModelName()).thenReturn("llama-3.3-70b");
        when(fallbackProvider.isConfigured()).thenReturn(true);

        logRepository = mock(AiRequestLogRepository.class);

        aiRouter = new AiRouter(List.of(primaryProvider, fallbackProvider), logRepository);
    }

    @Test
    @DisplayName("Should execute via primary provider when healthy")
    void execute_PrimarySuccess() throws Exception {
        when(primaryProvider.generate(anyString())).thenReturn("{\"status\":\"success\"}");

        String result = aiRouter.execute("Test prompt", "/generate");

        assertNotNull(result);
        assertEquals("{\"status\":\"success\"}", result);
        verify(primaryProvider, times(1)).generate(anyString());
        verify(fallbackProvider, never()).generate(anyString());
    }

    @Test
    @DisplayName("Should automatically fail over to fallback provider when primary throws exception")
    void execute_FailoverToFallback() throws Exception {
        when(primaryProvider.generate(anyString())).thenThrow(new RuntimeException("429 Rate Limit Exceeded"));
        when(fallbackProvider.generate(anyString())).thenReturn("{\"status\":\"fallback_success\"}");

        String result = aiRouter.execute("Test prompt", "/generate");

        assertNotNull(result);
        assertEquals("{\"status\":\"fallback_success\"}", result);
        verify(primaryProvider, times(2)).generate(anyString());
        verify(fallbackProvider, times(1)).generate(anyString());
    }
}
