import {getToken, removeToken} from "@/hooks/token";
import {apiClient, authHeaders} from "@/api/apiClient";
import {Linking} from "react-native";
import {API_URL} from "@/constants/constants";
import {authEmitter, redirectIndex, showAlert} from "@/utils/utils";

export const handleGoogleLogin = async () => {
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
