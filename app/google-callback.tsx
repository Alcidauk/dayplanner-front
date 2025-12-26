import { useEffect } from "react";
import { View, Text } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import styles from "@/styles/styles";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {showAlert} from "@/utils/utils";

const storeToken = async (token: string) => {
    try {
        await AsyncStorage.setItem("jwt", token);
        console.log("Token stocké sur mobile !");
    } catch (error) {
        console.error("Erreur stockage token :", error);
    }
};

export default function GoogleCallback() {
    const params = useLocalSearchParams();
    const router = useRouter();

    useEffect(() => {
        const token : string | string[] = params.token;
        if (token) {
            if (typeof window !== "undefined") {
                localStorage.setItem("jwt", token); // web
            }

            storeToken(token); // Mobile

            // Alert cross-platform
            showAlert("Succès", "Connexion Google réussie !");

            const timer = setTimeout(() => {
                router.replace("/"); // ← remplace la route
            }, 50);
        } else {
            showAlert("Erreur", "Token manquant !");
        }
    }, []); // useEffect unique

    return (
        <View style={styles.container}>
            <Text>Connexion en cours…</Text>
        </View>
    );
}
