import { router } from "expo-router";
import { EventEmitter } from "events";
import {getAccessToken} from "@/hooks/token";
import {showAlert} from "@/utils/alertManager";
import {useFocusEffect} from "@react-navigation/core";
import {useCallback} from "react";


export const handleErrorMessages = (error: any) => {
    let message: string = "Erreur inconnue";
    if (error?.response?.data?.detail) {
        const detail = error.response.data.detail;
        if (Array.isArray(detail)) {
            message = detail.map((err: any) => {
                if (typeof err === 'string') return err;
                if (err.msg) {
                    const location = err.loc ? err.loc.join(' -> ') : '';
                    return location ? `${location}: ${err.msg}` : err.msg;
                }
                return JSON.stringify(err);
            }).join('\n');
        }
        else if (typeof detail === 'string') {
            message = detail;
        }
        else if (typeof detail === 'object') {
            message = detail.msg || detail.message || JSON.stringify(detail);
        }
    }
    else if (error?.response?.data) {
        if (typeof error.response.data === 'string') {
            message = error.response.data;
        } else {
            message = JSON.stringify(error.response.data);
        }
    }
    else if (error instanceof Error) {
        message = error.message;
    }
    else if (error?.detail) {
        message = error.detail;
    }
    else if (error?.error) {
        message = error.error;
    } else {
        message = JSON.stringify(error);
    }
    return message
}

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
        let message: string = handleErrorMessages(error)
        showAlert("error", "Erreur", message);
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

export const reloadPageData = (functionToApply: Function) => {
    useFocusEffect(
        useCallback(() => {
            functionToApply();
        }, [functionToApply])
    );
}
