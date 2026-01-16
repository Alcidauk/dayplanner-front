import {useEffect, useState} from "react";
import { authEmitter } from "@/utils/utils";
import {getToken} from "@/hooks/token";

export const useAuth = () => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

    useEffect(() => {
        let token = getToken()
        setIsAuthenticated(!!token);

        const listener = () => getToken();
        authEmitter.addListener("authChanged", listener);

        return () => {
            authEmitter.removeListener("authChanged", listener);
        };
    }, []);

    return { isAuthenticated, getToken };
};
