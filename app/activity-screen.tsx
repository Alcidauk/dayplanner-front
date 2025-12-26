import { useEffect, useState } from "react";
import { View, Text, FlatList, ActivityIndicator } from "react-native";
import { getActivities } from "@/api/activityApi";
import styles from "@/styles/styles"
import {showAlert} from "@/utils/utils";

export default function ActivityScreen() {
    const [activities, setActivities] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchActivities = async () => {
            try {
                // 🔐 récupérer le JWT
                const token = localStorage.getItem("jwt"); // web
                // mobile → AsyncStorage.getItem("jwt")

                if (!token) {
                    showAlert("Erreur", "Utilisateur non authentifié");
                    return;
                }

                const response = await getActivities(token);
                console.log("Réponse brute API :", response);

                // 🧠 GPT renvoie du JSON sous forme de string
                const parsed = JSON.parse(response.activities);

                setActivities(parsed.activities ?? []);
            } catch (error) {
                console.error(error);
                showAlert("Erreur", "Impossible de charger les activités");
            } finally {
                setLoading(false);
            }
        };

        fetchActivities();
    }, []);

    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" />
                <Text>Chargement des activités...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Activités recommandées</Text>

            <FlatList
                data={activities}
                keyExtractor={(_, index) => index.toString()}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>{item.title}</Text>
                        <Text style={styles.cardDescription}>{item.description}</Text>
                        {item.duration && (
                            <Text style={styles.cardMeta}> {item.duration}</Text>
                        )}
                    </View>
                )}
            />
        </View>
    );
}
