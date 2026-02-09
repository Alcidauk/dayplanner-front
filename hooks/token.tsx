import {Platform} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {showAlert} from "@/utils/utils";
import { jwtDecode } from 'jwt-decode';
import {logout} from "@/api/authApi";
import {TokenData} from "@/api/types";

export const getTokenData = async (): Promise<TokenData | null> => {
    try {
        let data: string | null;

        if (Platform.OS === "web") {
            data = localStorage.getItem("auth_tokens");
        } else {
            data = await AsyncStorage.getItem("auth_tokens");
        }

        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error("Error getting token data:", error);
        return null;
    }
};

export const getRefreshToken = async (): Promise<string | null> => {
    const tokenData = await getTokenData();
    return tokenData?.refresh_token || null;
};

export const getAccessToken = async (): Promise<string | null> => {
    const tokenData = await getTokenData();
    return tokenData?.access_token || null;
};

export const isTokenExpired = async (bufferSeconds: number = 300): Promise<boolean> => {
    const tokenData = await getTokenData();
    if (!tokenData) return true;
    return Date.now() >= (tokenData.expires_at - bufferSeconds * 1000);
};


export const clearTokens = async () => {
    try {
        if (Platform.OS === "web") {
            localStorage.removeItem("auth_tokens");
        } else {
            await AsyncStorage.removeItem("auth_tokens");
        }
    } catch (error: any) {
        showAlert('error', error.response?.data?.detail)}
}

export const storeTokens = async (accessToken: string, refreshToken: string, expiresIn: number = 3600) => {
    try {
        const expiresAt = Date.now() + (expiresIn * 1000);
        const tokenData: TokenData = {
            access_token: accessToken,
            refresh_token: refreshToken,
            expires_at: expiresAt
        };
        if (Platform.OS === "web") {
            localStorage.setItem("auth_tokens", JSON.stringify(tokenData));
        } else {
            await AsyncStorage.setItem("auth_tokens", JSON.stringify(tokenData));
        }
    } catch (error: any) {
        let message = "Erreur inconnue";
        if (error instanceof Error) {
            message = error.message;
        } else if (error?.response?.data?.detail) {
            message = error.response.data.detail;
        } else {
            message = JSON.stringify(error);
        }
        showAlert('error', message)
    }
};

