// api.ts
import axios from "axios";
import type { AxiosResponse, InternalAxiosRequestConfig } from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_PUBLIC_BACKEND_API_URL || "http://localhost:3000/api",
});

export const setupApiInterceptor = () => {
  api.interceptors.request.use(
    (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
      const skipAuthPaths = ["/auth/login", "/auth/signup"];
      const shouldSkip = skipAuthPaths.some((path) => config.url?.includes(path));

      const token = localStorage.getItem("accessToken");
      if (token && !shouldSkip && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    },
    (error) => Promise.reject(error)
  );

  api.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error) => {
      if (error.response?.status === 401) {
        console.log("Unauthorized! Token may have expired.");
        // TODO: optional redirect to login
      }
      return Promise.reject(error);
    }
  );

  return api;
};

export default api;
