import axios from "axios";
import { toast } from "sonner";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api/v1";

export const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

let getTokenFn = null;

export const setClerkTokenGetter = (fn) => {
  getTokenFn = fn;
};

// Request Interceptor: Attach Clerk JWT
axiosClient.interceptors.request.use(
  async (config) => {
    if (getTokenFn) {
      try {
        const token = await getTokenFn();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (err) {
        console.warn("Failed to get Clerk JWT token:", err);
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Standardized handling & Rate Limit toasts
axiosClient.interceptors.response.use(
  (response) => {
    // Unwraps standardized backend ApiResponse wrapper
    if (response.data && response.data.success !== undefined) {
      return response.data.data !== undefined ? response.data.data : response.data;
    }
    return response.data;
  },
  (error) => {
    if (error.response) {
      const status = error.response.status;
      const errorData = error.response.data?.error || error.response.data;

      if (status === 429) {
        const retryAfter = error.response.headers["retry-after"] || errorData?.details?.retryAfterSeconds || 60;
        const message = errorData?.message || "Rate limit reached. Please upgrade to Pro for higher limits.";
        toast.error(`Rate Limit Exceeded: ${message}`, {
          description: `Resets in approximately ${Math.ceil(retryAfter / 60)} minutes.`,
          duration: 8000,
        });
      } else if (status === 401) {
        toast.error("Session expired or unauthorized. Please sign in again.");
      } else if (status >= 500) {
        toast.error("AI service transient issue. Automatic retry / failover in progress...");
      } else {
        toast.error(errorData?.message || "An unexpected error occurred.");
      }
    } else {
      toast.error("Network error. Unable to connect to server.");
    }
    return Promise.reject(error);
  }
);
