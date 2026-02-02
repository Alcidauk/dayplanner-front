import {Platform} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {showAlert} from "@/utils/utils";
import { jwtDecode } from 'jwt-decode';
import {logout} from "@/api/authApi";

export const getToken = async (): Promise<string | null> => {
    let token: string | null;

    if (Platform.OS === "web") {
        token = localStorage.getItem("jwt");
    } else {
        token = await AsyncStorage.getItem("jwt");
    }
    if (!token) return null;
    try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        if (decoded.exp && decoded.exp < currentTime) {
            removeToken();
            logout();
            showAlert("Info", "Token Expiré");
            return null;
        }
        return token;
    } catch (error) {
        removeToken();
        logout();
        showAlert("Erreur", `Erreur lors du décodage du token:', ${error}`);
        return null;
    }
};

export const removeToken = async () => {
    try {
        if (Platform.OS === "web") {
            localStorage.removeItem("jwt");
        } else {
            await AsyncStorage.removeItem("jwt");
        }
    } catch (error: any) {
        showAlert('error', error.response?.data?.detail)}
}

export const storeToken = async (token: string | undefined) => {
    try {
        if (typeof token === "string") {
            if (Platform.OS === "web") {
                localStorage.setItem("jwt", token);
            } else {
                await AsyncStorage.setItem("jwt", token);
            }
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

