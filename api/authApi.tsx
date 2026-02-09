import {getAccessToken, clearTokens, storeTokens} from "@/hooks/token";
import {apiClient, authHeaders} from "@/api/apiClient";
import {Linking} from "react-native";
import {API_URL} from "@/constants/constants";
import {authEmitter, handleErrorMessages, redirectHome, redirectIndex} from "@/utils/utils";
import {LoginPayload, TokenData} from "@/api/types";
import {tokenRefreshService} from "@/services/tokenRefreshService";
import { showAlert } from '@/utils/alertManager';


export const login = async ({email, password}:LoginPayload) => {
    try {
        const response =    await apiClient.post(`${API_URL}/auth/login`, {
            email,
            password
        });

        const { access_token, refresh_token, expires_in } = response.data;
        await storeTokens(access_token, refresh_token, expires_in || 3600);
        tokenRefreshService.start();
        authEmitter.emit("authChanged");
        redirectHome()
    } catch (e: any) {
        showAlert('error', "Erreur", `Erreur de connexion: ${e.message}`);
    }
};

export const refreshToken = async (tokenData: TokenData) => {
    return await apiClient.post(`${API_URL}/auth/refresh`, {
        refresh_token: tokenData.refresh_token,
    });
}

export const googleLogin = async () => {
    const url = `${API_URL}/auth/google/login`;
    await Linking.openURL(url);

};

export const logout = async () => {
    tokenRefreshService.stop();
    const token = await getAccessToken();
    if (token) {
        try {
            await apiClient.post(`${API_URL}/auth/logout`, {}, authHeaders(token));
        } catch (error) {
            let message = handleErrorMessages(error)
            showAlert('error', "Erreur", ` ${message}: Logout backend failed, continuing local logout`);
        } finally {
            await clearTokens();
            authEmitter.emit("authChanged");
            redirectIndex();
            showAlert("info", "Info", "Utilisateur déconnecté");
        }
    } else {
        redirectIndex();
    }
};
