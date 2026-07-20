package org.example.ai_resume_builder.exception;

import org.springframework.http.HttpStatus;

import java.util.Map;

public class RateLimitExceededException extends ApiException {

    private final long retryAfterSeconds;
    private final long resetTimestamp;

    public RateLimitExceededException(String message, long retryAfterSeconds, long resetTimestamp) {
        super(message, HttpStatus.TOO_MANY_REQUESTS, "RATE_LIMIT_EXCEEDED", Map.of(
                "retryAfterSeconds", retryAfterSeconds,
                "resetTimestamp", resetTimestamp,
                "friendlyMessage", "You have reached your free daily limit. Upgrade to Pro for unlimited access."
        ));
        this.retryAfterSeconds = retryAfterSeconds;
        this.resetTimestamp = resetTimestamp;
    }

    public long getRetryAfterSeconds() {
        return retryAfterSeconds;
    }

    public long getResetTimestamp() {
        return resetTimestamp;
    }
}
