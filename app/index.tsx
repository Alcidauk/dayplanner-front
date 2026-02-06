import {Text, View, Button, TextInput} from "react-native";
import styles from "@/styles/styles";
import {useState} from "react";
import {login, googleLogin} from "@/api/authApi";
import AppButton from "@/components/app_button";

export default function Index() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

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

                    <AppButton title="Se connecter" onPress={() => login({ email, password })} />
                    <Text style={{ marginVertical: 20 }}>ou</Text>
            <AppButton title="Se connecter avec Google" onPress={googleLogin} />
        </View>
    );
}
