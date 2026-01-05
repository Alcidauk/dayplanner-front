import { useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { API_URL } from "@/constants/constants";
import { apiClient, authHeaders } from "@/api/apiClient";
import {showAlert} from "@/utils/utils";

export default function LogoutScreen() {
    useEffect(() => {
        const logout = async () => {
            try {
                const token = await AsyncStorage.getItem("jwt");

                if (token) {
                    await apiClient.post(`${API_URL}/auth/logout`, {}, authHeaders(token));
                }
            } catch (error) {
                console.warn("Logout backend failed, continuing local logout");
            } finally {
                await AsyncStorage.removeItem("jwt");
                router.replace("/");
                showAlert("Info", "Utilisateur déconnecté")
            }
        };

        logout();
    }, []);

    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <ActivityIndicator size="large" />
        </View>
    );
}
