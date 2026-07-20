package org.example.ai_resume_builder.exception;

import org.springframework.http.HttpStatus;

public class ApiException extends RuntimeException {

    private final HttpStatus status;
    private final String errorCode;
    private final Object details;

    public ApiException(String message, HttpStatus status, String errorCode) {
        super(message);
        this.status = status;
        this.errorCode = errorCode;
        this.details = null;
    }

    public ApiException(String message, HttpStatus status, String errorCode, Object details) {
        super(message);
        this.status = status;
        this.errorCode = errorCode;
        this.details = details;
    }

    public HttpStatus getStatus() {
        return status;
    }

    public String getErrorCode() {
        return errorCode;
    }

    public Object getDetails() {
        return details;
    }
}
