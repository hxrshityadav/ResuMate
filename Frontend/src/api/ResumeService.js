import axios from "axios";

export const baseURL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8080";

export const axiosInstance = axios.create({
    baseURL,
    timeout: 30000,
    headers: {
        "Content-Type": "application/json"
    }
});

export const generateResume = async (description) => {
    try {
        const response = await axiosInstance.post(
            "/api/v1/resume/generate",
            {
                userDescription: description
            }
        );

        return response.data;

    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const checkAtsScore = async (resumeText, jobDescription = "") => {
    try {
        const response = await axiosInstance.post(
            "/api/v1/resume/ats-check",
            {
                resumeText,
                jobDescription
            }
        );

        return response.data;

    } catch (error) {
        throw error.response?.data || error.message;
    }
};