import { Stack } from "expo-router";

export default function RootLayout() {
    return (
        <Stack>
            {/* Tabs */}
            <Stack.Screen
                name="(tabs)"
                options={{ headerShown: false }}
            />
        </Stack>
    );
}
