import {Alert, Platform} from "react-native";
import { router } from "expo-router";
import { EventEmitter } from "events";
import {getToken} from "@/hooks/token";

export const showAlert = (title: string, message: string) => {
    if (Platform.OS === "web") {
        window.alert(`${title}\n${message}`);
    } else {
        Alert.alert(title, message);
    }
};

export const redirectHome = (delay = 50) => {
    setTimeout(() => {
        router.replace("/(auth)");
    }, delay);
};

export const redirectIndex = (delay = 50) => {
    setTimeout(() => {
        router.replace("/(public)");
    }, delay);
};


export const requireAuth = async (): Promise<string | null> => {
    try {
        const token = await getToken();
        if (!token) {
            showAlert("Erreur", "Utilisateur non authentifié");
            redirectIndex();
            return null;
        }
        return token;
    } catch (error) {
        showAlert("Erreur", "Impossible de récupérer le token");
        redirectIndex();
        return null;
    }
};

export const authEmitter = new EventEmitter();
