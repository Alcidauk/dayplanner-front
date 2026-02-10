import axios from "axios";
import { API_URL } from "@/constants/constants";
import {getAccessToken, isTokenExpired} from "@/hooks/token";
import {tokenRefreshService} from "@/services/tokenRefreshService";

export const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});
export const authHeaders = (token: string | null) => ({
    headers: {
        Authorization: `Bearer ${token}`,
    },
});

apiClient.interceptors.request.use(
    async (config) => {
        const expired: boolean = await isTokenExpired(60);

        if (expired) {
            console.log('Token expired, refreshing before request...');
            await tokenRefreshService.refreshToken();
        }

        const token: string | null = await getAccessToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            console.log('401 error, attempting token refresh...');

            const success = await tokenRefreshService.refreshToken();
            if (success) {
                const token = await getAccessToken();
                originalRequest.headers.Authorization = `Bearer ${token}`;
                return apiClient(originalRequest);
            }
        }
        return Promise.reject(error);
    }
);
export default apiClient;
