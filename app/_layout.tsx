import {Stack, useSegments} from "expo-router";
import {useEffect, useState} from "react";
import LoadingView from "@/components/loading_view";
import {tokenRefreshService} from "@/services/tokenRefreshService";
import {getAccessToken} from "@/hooks/token";
import {authEmitter, redirectHome, redirectIndex} from "@/utils/utils";

export default function RootLayout() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const segments = useSegments();

    const checkAuth = async () => {
        const token = await getAccessToken();
        const authenticated = !!token;

        setIsAuthenticated(authenticated);
        setIsLoading(false);

        if (authenticated) {
            tokenRefreshService.start();
        } else {
            tokenRefreshService.stop();
        }
    };

    const handleAuthChange = async () => {
        await checkAuth();
    };

    useEffect(() => {
        checkAuth();
        const listener = authEmitter.addListener("authChanged", handleAuthChange);
        return () => {
            listener.removeListener("authChanged", handleAuthChange)
            tokenRefreshService.stop();
        };
    }, []);
    useEffect(() => {
        if (isLoading) return;

        const inAuthGroup = segments[0] === "(auth)";
        const inPublicGroup = segments[0] === "(public)";

        if (!isAuthenticated && inAuthGroup) {
            // Non authentifié mais dans le groupe auth → rediriger vers public
            redirectIndex();
        } else if (isAuthenticated && inPublicGroup) {
            // Authentifié mais dans le groupe public → rediriger vers auth
            redirectHome();
        } else if (!inAuthGroup && !inPublicGroup) {
            // Première visite → rediriger vers le bon groupe
            if (isAuthenticated) {
                redirectHome();
            } else {
                redirectIndex();
            }
        }
    }, [isAuthenticated, isLoading, segments]);

    if (isLoading) {
        return <LoadingView/>;
    }

    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen
                name="(public)"
            />
            <Stack.Screen
                name="(auth)"
            />
            <Stack.Screen
                name="google-callback"
            />
        </Stack>
    );
}
