import { useState } from "react";
import { View, Text, TextInput, Button } from "react-native";
import { createUser } from "@/api/userApi";
import axios from "axios";
import styles from "@/styles/styles";

import {showAlert} from "@/utils/utils";

export default function RegisterScreen() {
    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);




    const handleRegister = async () => {
        if (!name || !surname || !email || !password) {
            showAlert("Erreur", "Tous les champs sont obligatoires");
            return;
        }

        setLoading(true);

        try {
            const user = await createUser({ name, surname, email, password });
            console.log("USER RETOUR API:", user);

            setTimeout(() => {
                showAlert("Succès", `Compte créé pour ${user.email}`);
            }, 0);

        } catch (error: unknown) {

            if (axios.isAxiosError(error)) {
                showAlert("Erreur", error.response?.data?.detail ?? "Erreur serveur");
            } else {
                showAlert("Erreur", "Erreur inconnue");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>

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

            <TextInput
                placeholder="Mot de Passe"
                value={password}
                onChangeText={setPassword}
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
