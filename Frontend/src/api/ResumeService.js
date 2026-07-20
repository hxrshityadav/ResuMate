import { axiosClient } from "./axiosClient";

export const axiosInstance = axiosClient;

export const generateResume = async (description) => {
    try {
        const response = await axiosClient.post("/resume/generate", {
            userDescription: description
        });
        return response;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const enhanceResumeSection = async (sectionType, content) => {
    try {
        const response = await axiosClient.post("/resume/improve-section", {
            sectionType,
            content
        });
        return response;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const checkAtsScore = async (resumeText, jobDescription = "") => {
    try {
        const response = await axiosClient.post("/resume/ats-check", {
            resumeText,
            jobDescription
        });
        return response;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};
