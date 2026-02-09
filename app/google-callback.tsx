import { useEffect } from "react";
import {View, Text, ActivityIndicator} from "react-native";
import { useLocalSearchParams} from "expo-router";
import styles from "@/styles/styles";
import {authEmitter, redirectHome, redirectIndex} from "@/utils/utils";
import {storeTokens} from "@/hooks/token";
import {showAlert} from "@/utils/alertManager";
import {tokenRefreshService} from "@/services/tokenRefreshService";
import LoadingView from "@/components/loading_view";

export default function GoogleCallback() {
    const { accessToken, refreshToken, expiresIn } = useLocalSearchParams<{
        accessToken?: string;
        refreshToken?: string;
        expiresIn?: string;
    }>();

    useEffect(() => {
        const handleCallback = async () => {

            if (!accessToken || !refreshToken) {
                console.error("Missing tokens");
                showAlert('error', "Erreur","Authentification Google échouée");
                redirectIndex();
                return;
            }
            try {
                const expiresInSeconds = expiresIn ? parseInt(expiresIn) : 3600;
                await storeTokens(accessToken, refreshToken, expiresInSeconds);

                tokenRefreshService.start();
                authEmitter.emit("authChanged");

                showAlert('success',"Succès","Connexion Google réussie !");
                redirectHome();
            } catch (error) {
                console.error("Error storing tokens:", error);
                showAlert('error', "Erreur", "Erreur lors de la sauvegarde des tokens");
                redirectIndex();
            }
        };
        handleCallback();
    }, [accessToken, refreshToken, expiresIn]);

    return (
        <View style={styles.container}>
            <LoadingView/>
        </View>
    );
}
