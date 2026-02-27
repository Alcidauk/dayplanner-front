import { useState } from "react";
import { View, Text, TextInput, Button } from "react-native";
import { register } from "@/api/userApi";
import styles from "@/styles/styles";
import AppButton from "@/components/app_button";


export default function RegisterScreen() {
    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");


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

            <AppButton
                title={"Créer le compte"}
                disabled={false}
                onPress={() => register({ name, surname, email, password })}
            />
        </View>
    );
}
