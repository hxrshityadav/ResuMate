import axios from "axios";

const DEFAULT_PROD_BACKEND = "https://resumate-olive.up.railway.app";

function normalizeBaseUrl(url) {
    if (!url) return "";
    return String(url).trim().replace(/\/+$/, "");
}

function isLocalhostUrl(url) {
    try {
        const u = new URL(url);
        return u.hostname === "localhost" || u.hostname === "127.0.0.1";
    } catch {
        return false;
    }
}

const envBase = normalizeBaseUrl(import.meta.env.VITE_BACKEND_URL);

// Safety: if Vercel PROD is accidentally configured with localhost, fall back to Railway.
export const baseURL =
    import.meta.env.PROD && isLocalhostUrl(envBase)
        ? DEFAULT_PROD_BACKEND
        : (envBase || DEFAULT_PROD_BACKEND);

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
