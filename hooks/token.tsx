import {Platform} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {showAlert} from "@/utils/utils";

export const getToken = async (): Promise<string | null> => {
    if (Platform.OS === "web") {
        return localStorage.getItem("jwt");
    } else {
        return await AsyncStorage.getItem("jwt");
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

