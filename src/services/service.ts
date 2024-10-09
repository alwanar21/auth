import axios from "axios";
import Cookies from "js-cookie";
import { setAccessTokenCookies, setRefreshTokenCookies } from "../utils/cookies";
import { RefreshToken } from "./auth-service";

const baseURL = import.meta.env.VITE_DB_PORT;

const PublicInstance = axios.create({
  baseURL,
  timeout: 10000,
});

const PrivateInstance = axios.create({
  baseURL,
  timeout: 10000,
});

PrivateInstance.interceptors.request.use(
  (config) => {
    const accessToken = Cookies.get("accessToken");

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

PrivateInstance.interceptors.response.use(
  (response) => response, // Directly return successful responses.
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const response = await RefreshToken();
        // Store the new access and refresh tokens.
        setAccessTokenCookies(response.data.data.accessToken);
        setRefreshTokenCookies(response.data.data.refreshToken);
        PrivateInstance.defaults.headers.common["Authorization"] = `Bearer ${response.data.data.accessToken}`;
        return PrivateInstance(originalRequest);
      } catch (refreshError) {
        Cookies.remove("accessToken");
        Cookies.remove("isAuthenticated");
        Cookies.remove("refreshToken");
        window.location.href = "/";
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error); // For all other errors, return the error as is.
  }
);

export { PublicInstance, PrivateInstance };
