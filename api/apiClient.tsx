import axios from "axios";
import { API_URL } from "@/constants/constants";

export const apiClient = axios.create({
    baseURL: API_URL,
});

export const authHeaders = (token: string) => ({
    headers: {
        Authorization: `Bearer ${token}`,
    },
});
