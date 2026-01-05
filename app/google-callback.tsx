import { useEffect } from "react";
import { View, Text } from "react-native";
import { useLocalSearchParams } from "expo-router";
import styles from "@/styles/styles";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {redirectHome, showAlert} from "@/utils/utils";

const storeToken = async (token: string | string[]) => {
    try {
        if (typeof token === "string") {
            await AsyncStorage.setItem("jwt", token);
        }
        console.log("Token stocké sur mobile !");
    } catch (error) {
        console.error("Erreur stockage token :", error);
    }
};

export default function GoogleCallback() {
    const params = useLocalSearchParams();

    useEffect(() => {
        const token : string | string[] = params.token;
        if (token) {
            if (typeof window !== "undefined") {
                if (typeof token === "string") {
                    localStorage.setItem("jwt", token);
                } // web
            }
            storeToken(token); // Mobile
            showAlert("Succès", "Connexion Google réussie !");
            redirectHome()
        } else {
            showAlert("Erreur", "Token manquant !");
        }
    }, []);

    return (
        <View style={styles.container}>
            <Text>Connexion en cours…</Text>
        </View>
    );
}
