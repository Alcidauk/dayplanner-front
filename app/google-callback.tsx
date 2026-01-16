import { useEffect } from "react";
import { View, Text } from "react-native";
import { useLocalSearchParams} from "expo-router";
import styles from "@/styles/styles";
import {authEmitter, redirectHome, redirectIndex} from "@/utils/utils";
import {storeToken} from "@/hooks/token";

export default function GoogleCallback() {
    const { token } = useLocalSearchParams<{ token?: string }>();

    useEffect(() => {
        const handleCallback = async () => {
            if (!token) {
                redirectIndex();
                return;
            }

            await storeToken(token);
            authEmitter.emit("authChanged");
            redirectHome();
        };
        handleCallback();
    }, [token]);

    return (
        <View style={styles.container}>
            <Text>Connexion en cours…</Text>
        </View>
    );
}
