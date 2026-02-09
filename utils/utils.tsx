import {Alert, Platform} from "react-native";
import { router } from "expo-router";
import { EventEmitter } from "events";
import {getAccessToken} from "@/hooks/token";
import {showAlert} from "@/utils/alertManager";

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
        const token = await getAccessToken();
        if (!token) {
            showAlert("error", "Erreur", "Utilisateur non authentifié");
            redirectIndex();
            return null;
        }
        return token;
    } catch (error) {
        showAlert("error", "Erreur", "Impossible de récupérer le token");
        redirectIndex();
        return null;
    }
};

export const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
    });
};

export const authEmitter = new EventEmitter();
