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
        if (typeof window !== "undefined") { localStorage.removeItem("jwt");
        } else {
            await AsyncStorage.removeItem("jwt");
        }
    } catch (error: any) {
        showAlert('error', error)}
}

export const storeToken = async (token: string | undefined) => {
    try {
        if (typeof token === "string") {
            if (typeof window !== "undefined") {
                localStorage.setItem("jwt", token);
            } else {
                await AsyncStorage.setItem("jwt", token);
            }
        }
    } catch (error: any) {
        showAlert('error', error)
    }
};

