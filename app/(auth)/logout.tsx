import {useEffect} from "react";
import {View, ActivityIndicator} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {API_URL} from "@/constants/constants";
import {apiClient, authHeaders} from "@/api/apiClient";
import {authEmitter, showAlert, redirectIndex} from "@/utils/utils";
import {getToken, removeToken} from "@/hooks/token";

export default function LogoutScreen() {
    useEffect(() => {
        const logout = async () => {
            const token = await getToken();

            if (token) {
                try {
                    await apiClient.post(`${API_URL}/auth/logout`, {}, authHeaders(token));
                    removeToken();
                    authEmitter.emit("authChanged");
                } catch (error) {
                    console.warn("Logout backend failed, continuing local logout");
                } finally {
                    await AsyncStorage.removeItem("jwt");
                    redirectIndex();
                    showAlert("Info", "Utilisateur déconnecté");
                }
            }
        };
        logout();
    }, []);

    return (
        <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
            <ActivityIndicator size="large"/>
        </View>
    );
}
