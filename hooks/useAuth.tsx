import {useEffect, useState} from "react";
import { authEmitter } from "@/utils/utils";
import {getAccessToken} from "@/hooks/token";

export const useAuth = () => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

    useEffect(() => {
        let token = getAccessToken()
        setIsAuthenticated(!!token);

        const listener = () => getAccessToken();
        authEmitter.addListener("authChanged", listener);

        return () => {
            authEmitter.removeListener("authChanged", listener);
        };
    }, []);

    return { isAuthenticated, getToken: getAccessToken };
};
