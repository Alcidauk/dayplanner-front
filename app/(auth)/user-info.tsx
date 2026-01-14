import { useState } from "react";
import { Text, TextInput, Button, ScrollView } from "react-native";
import { addUserInfo } from "@/api/userInfoApi";
import {redirectHome, showAlert} from "@/utils/utils";
import styles from "@/styles/styles";

export default function UserInfo() {
    const [place, setPlace] = useState("");
    const [interests, setInterests] = useState(""); // comma-separated string
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!place || !interests) {
            showAlert("Erreur", "Tous les champs sont obligatoires");
            return;
        }

        setLoading(true);
        try {
            const data = {
                place,
                interests: interests.split(",").map((i) => i.trim()),
            };
            const response = await addUserInfo(data);
            showAlert("Succès", "Informations mises à jour !");
        } catch (error: any) {
            showAlert("Erreur", error.response?.data?.detail || "Erreur serveur");
        } finally {
            setLoading(false);
        }
        redirectHome()
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
