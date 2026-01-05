// hooks/useAuth.ts
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authEmitter } from "@/utils/utils";

export const useAuth = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const checkToken = async () => {
        const tokenWeb = typeof window !== "undefined" ? localStorage.getItem("jwt") : null;
        const tokenMobile = await AsyncStorage.getItem("jwt");
        const token = tokenWeb || tokenMobile;
        setIsAuthenticated(!!token);
    };

    useEffect(() => {
        // Check au montage
        checkToken();

        // Écoute les changements d’auth
        const listener = () => checkToken();
        authEmitter.on("authChanged", listener);

        return () => {
            authEmitter.off("authChanged", listener);
        };
    }, []);

    return { isAuthenticated };
};
