import {Text, View, Button, Linking, TextInput} from "react-native";
import styles from "@/styles/styles";
import {API_URL} from "@/constants/constants";
import {authEmitter, redirectHome, showAlert} from "@/utils/utils";
import {storeToken} from "@/hooks/token";
import {useState} from "react";

const handleGoogleLogin = async () => {
    const url = `${API_URL}/auth/google/login`;
    await Linking.openURL(url);

};

export default function Index() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async () => {
        try {
            const res = await fetch(`${API_URL}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            if (!res.ok) {
                showAlert("Error","Login failed");
            }
            const data = await res.json();
            await storeToken(data.access_token)
            authEmitter.emit("authChanged");
            redirectHome()
        } catch (e: any) {
            showAlert("Erreur",`Erreur de connexion: ${e.message || JSON.stringify(e)}`);
        }
    };

            return (
                <View style={styles.container}>
                    <Text style={styles.title}>Dayplanner Front</Text>
                    <Text style={styles.title}>Connexion</Text>

                    <TextInput
                        placeholder="Email"
                        value={email}
                        onChangeText={setEmail}
                        autoCapitalize="none"
                        keyboardType="email-address"
                        style={styles.input}
                    />

                    <TextInput
                        placeholder="Mot de passe"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                        style={styles.input}
                    />

                    <Button title="Se connecter" onPress={handleLogin} />
                    <Text style={{ marginVertical: 20 }}>ou</Text>
            <Button title="Se connecter avec Google" onPress={handleGoogleLogin} />
        </View>
    );
}
