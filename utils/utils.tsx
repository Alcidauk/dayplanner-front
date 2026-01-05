import {Alert, Platform} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { EventEmitter } from "events";

export const showAlert = (title: string, message: string) => {
    if (Platform.OS === "web") {
        window.alert(`${title}\n${message}`);
    } else {
        Alert.alert(title, message);
    }
};

export const redirectHome = (delay = 50) => {
    setTimeout(() => {
        router.replace("/");
    }, delay);
};

export const getToken = async (): Promise<string | null> => {
    if (Platform.OS === "web") {
        console.log("Token envoyé:", localStorage.getItem("jwt"));
        return localStorage.getItem("jwt");
    } else {
        console.log("Token envoyé:", AsyncStorage.getItem("jwt"));
        return await AsyncStorage.getItem("jwt");
    }
};

export const requireAuth = async (): Promise<string | null> => {
    try {
        const token = await getToken();
        if (!token) {
            showAlert("Erreur", "Utilisateur non authentifié");
            router.replace("/");
            return null;
        }
        return token;
    } catch (error) {
        showAlert("Erreur", "Impossible de récupérer le token");
        router.replace("/");
        return null;
    }
};

export const authEmitter = new EventEmitter();
