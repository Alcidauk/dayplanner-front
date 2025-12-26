import { useState } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";
import { createUser } from "@/api/userApi";
import styles from "@/styles/styles";
import {Link} from "expo-router";

export default function Register() {
    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const handleRegister = async () => {
        if (!name || !surname || !email) {
            Alert.alert("Erreur", "Tous les champs sont obligatoires");
            return;
        }

        setLoading(true);

        try {
            const user = await createUser({ name, surname, email });
            Alert.alert("Succès", `Compte créé pour ${user.email}`);
        } catch (error) {
            if (error.response) {
                Alert.alert("Erreur", error.response.data.detail);
            } else {
                Alert.alert("Erreur", "Impossible de contacter le serveur");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Link href="/" style={styles.button}>
                Go to Home screen
            </Link>
            <Text style={styles.title}>Créer un compte</Text>

            <TextInput
                placeholder="Prénom"
                value={name}
                onChangeText={setName}
                style={styles.input}
            />

            <TextInput
                placeholder="Nom"
                value={surname}
                onChangeText={setSurname}
                style={styles.input}
            />

            <TextInput
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                style={styles.input}
            />

            <Button
                title={loading ? "Création..." : "Créer le compte"}
                onPress={handleRegister}
                disabled={loading}
            />
        </View>
    );
}

