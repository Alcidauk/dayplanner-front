import { useEffect } from "react";
import { View, Text } from "react-native";
import {useLocalSearchParams} from "expo-router";
import styles from "@/styles/styles";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {authEmitter, redirectHome, showAlert} from "@/utils/utils";

const storeToken = async (token: string | string[]) => {
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

export default function GoogleCallback() {
    const params = useLocalSearchParams();

    useEffect(() => {
        const handleCallback = async () => {
            const token = params?.token;
            if (!token) return;
            await storeToken(token);
            authEmitter.emit("authChanged");
            redirectHome();
        };
        handleCallback();
    }, [params]);


    return (
        <View style={styles.container}>
            <Text>Connexion en cours…</Text>
        </View>
    );
}
