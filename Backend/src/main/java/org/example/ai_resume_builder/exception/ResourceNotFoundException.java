package org.example.ai_resume_builder.exception;

import org.springframework.http.HttpStatus;

public class ResourceNotFoundException extends ApiException {
    public ResourceNotFoundException(String resourceName, String identifier) {
        super(resourceName + " not found with ID: " + identifier, HttpStatus.NOT_FOUND, "RESOURCE_NOT_FOUND");
    }
}
