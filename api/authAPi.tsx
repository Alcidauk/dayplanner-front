import {getToken, removeToken, storeToken} from "@/hooks/token";
import {apiClient, authHeaders} from "@/api/apiClient";
import {Linking} from "react-native";
import {API_URL} from "@/constants/constants";
import {authEmitter, redirectHome, redirectIndex, showAlert} from "@/utils/utils";
import {LoginPayload} from "@/api/types";


export const login = async ({email, password}:LoginPayload) => {
    try {
        const res = await fetch(`${API_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        if (!res.ok) {
            showAlert("Error","Login failed");
        }
        const data = await res.json();
        await storeToken(data.access_token)
        authEmitter.emit("authChanged");
        redirectHome()
    } catch (e: any) {
        showAlert("Erreur",`Erreur de connexion: ${e.message || JSON.stringify(e)}`);
    }
};

export const googleLogin = async () => {
    const url = `${API_URL}/auth/google/login`;
    await Linking.openURL(url);

};

export const logout = async () => {
    const token = await getToken();

    if (token) {
        try {
            await apiClient.post(`${API_URL}/auth/logout`, {}, authHeaders(token));
            removeToken();
            logout();
        } catch (error) {
            showAlert("Erreur", "Logout backend failed, continuing local logout");
        } finally {
            redirectIndex();
            authEmitter.emit("authChanged");
            showAlert("Info", "Utilisateur déconnecté");
        }
    } else {
        redirectIndex();
    }
};
