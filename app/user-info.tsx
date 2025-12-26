import { useState } from "react";
import { Text, TextInput, Button, ScrollView } from "react-native";
import { addUserInfo } from "@/api/userInfoApi";
import {showAlert} from "@/utils/utils";
import styles from "@/styles/styles";
import {useRouter} from "expo-router";

export default function UserInfo() {
    const [place, setPlace] = useState("");
    const [interests, setInterests] = useState(""); // comma-separated string
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async () => {
        if (!place || !interests) {
            showAlert("Erreur", "Tous les champs sont obligatoires");
            return;
        }

        setLoading(true);
        try {
            const token = localStorage.getItem("jwt"); // web
            // mobile: AsyncStorage.getItem("jwt")

            if (!token) {
                showAlert("Erreur", "Utilisateur non authentifié");
                setLoading(false);
                return;
            }

            const data = {
                place,
                interests: interests.split(",").map((i) => i.trim()),
            };

            const response = await addUserInfo(data, token);
            showAlert("Succès", "Informations mises à jour !");
            console.log("Response:", response);
        } catch (error: any) {
            console.error(error);
            showAlert("Erreur", error.response?.data?.detail || "Erreur serveur");
        } finally {
            setLoading(false);
        }
        const timer = setTimeout(() => {
            router.replace("/");
        }, 50);
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Vos informations</Text>

            <TextInput
                style={styles.input}
                placeholder="Lieu"
                value={place}
                onChangeText={setPlace}
            />

            <TextInput
                style={styles.input}
                placeholder="Centres d'intérêt (séparés par des virgules)"
                value={interests}
                onChangeText={setInterests}
                multiline={true}
                numberOfLines={2}
            />

            <Button
                title={loading ? "Enregistrement..." : "Enregistrer"}
                onPress={handleSubmit}
                disabled={loading}
            />
        </ScrollView>
    );
}
