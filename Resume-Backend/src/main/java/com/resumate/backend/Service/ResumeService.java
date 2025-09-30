package com.resumate.backend.Service;

import java.io.IOException;
import java.util.Map;

public interface ResumeService {

    Map<String, Object> generateResumeResponse(String userResumeDescription) throws IOException;
}
