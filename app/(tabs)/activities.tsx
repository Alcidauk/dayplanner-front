import { useEffect, useState } from "react";
import { View, Text, FlatList, ActivityIndicator } from "react-native";
import {getActivities} from "@/api/activityApi";
import styles from "@/styles/styles"
import {showAlert} from "@/utils/utils";
import {Activity} from "@/api/types";

export default function Activities() {
    const [activities, setActivities] = useState<Activity[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchActivities = async () => {
            try {
                const response = await getActivities();
                setActivities(response ?? []);
            } catch (error) {
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
                        {item.location && (
                            <Text style={styles.cardMeta}> {item.location}</Text>
                        )}
                    </View>
                )}
            />
        </View>
    );
}
