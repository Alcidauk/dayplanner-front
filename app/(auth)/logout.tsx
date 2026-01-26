import {useEffect} from "react";
import {View, ActivityIndicator} from "react-native";
import {API_URL} from "@/constants/constants";
import {apiClient, authHeaders} from "@/api/apiClient";
import {authEmitter, showAlert, redirectIndex} from "@/utils/utils";
import {getToken, removeToken} from "@/hooks/token";
import styles from "@/styles/styles";

export default function LogoutScreen() {
    useEffect(() => {
        const logout = async () => {
            const token = await getToken();

            if (token) {
                try {
                    await apiClient.post(`${API_URL}/auth/logout`, {}, authHeaders(token));
                    removeToken();
                    logout();
                    authEmitter.emit("authChanged");
                } catch (error) {
                    showAlert("Erreur","Logout backend failed, continuing local logout");
                } finally {
                    redirectIndex();
                    showAlert("Info", "Utilisateur déconnecté");
                }
            }
            else {
                redirectIndex();
            }
        };
        logout();
    }, []);

    return (
        <View style={styles.container}>
            <ActivityIndicator size="large"/>
        </View>
    );
}
