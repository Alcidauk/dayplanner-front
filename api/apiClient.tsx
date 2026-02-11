import axios from "axios";
import {API_URL, PUBLIC_ENDPOINTS} from "@/constants/constants";
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
        const isPublicEndpoint = PUBLIC_ENDPOINTS.some(
            (endpoint) => config.url?.includes(endpoint)
        );

        if (isPublicEndpoint) {
            return config;
        }

        const token: string | null = await getAccessToken();
        if (!token) {
            return config;
        }

        const expired = await isTokenExpired(60);
        if (expired) {
            await tokenRefreshService.refreshToken();
        }

        const freshToken = await getAccessToken();
        if (!freshToken) {
            return config;
        }
        config.headers.Authorization = `Bearer ${freshToken}`;
        return config;
    },
    Promise.reject
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
