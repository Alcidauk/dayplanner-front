import { useEffect, useState } from "react";
import { View, Text, FlatList, ActivityIndicator } from "react-native";
import { getGoogleCalendarEvents } from "@/api/calendarApi";
import styles from "@/styles/styles";
import axios from "axios";
import {formatDate, redirectHome, showAlert} from "@/utils/utils";

export default function CalendarScreen() {
    const [events, setEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await getGoogleCalendarEvents();
                setEvents(response);
            } catch (error: unknown) {
                if (axios.isAxiosError(error)) {
                    showAlert("Erreur", error.response?.data?.detail ?? "Erreur serveur");
                } else {
                    showAlert("Erreur", "Erreur inconnue");
                }
            } finally {
                setLoading(false);
                redirectHome()
            }
        };
        fetchEvents();
    }, []);

    if (loading) return <ActivityIndicator size="large" />;

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Événements de l’agenda Google</Text>
            <FlatList
                data={events}
                keyExtractor={(item: any) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>{item.title}</Text>
                        <Text style={styles.cardTitle}>{item.summary}</Text>
                        <Text style={styles.cardTitle}>{item.description}</Text>
                        <Text>{formatDate(item.start)} - {formatDate(item.end)}</Text>
                        {item.location && <Text>Lieu : {item.location}</Text>}
                    </View>
                        )}
            />
        </View>
)}
