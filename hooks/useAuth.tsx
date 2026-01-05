import { useState, useEffect } from "react";
import { authEmitter, getToken } from "@/utils/utils";

export const useAuth = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const checkToken = async () => {
        const token = await getToken();
        setIsAuthenticated(!!token);
    };

    useEffect(() => {
        checkToken();
        const listener = () => checkToken();
        authEmitter.on("authChanged", listener);

        return () => {
            authEmitter.off("authChanged", listener);
        };
    }, []);

    return { isAuthenticated };
};
