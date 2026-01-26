import { useEffect, useState } from "react";
import { View, Text, FlatList, ActivityIndicator } from "react-native";
import styles from "@/styles/styles";
import {getLocalCalendarEvents} from "@/utils/localCalendar";
import {formatDate} from "@/utils/utils";

export default function localCalendarScreen() {
    const [events, setEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const data = await getLocalCalendarEvents();
                setEvents(data);
            } catch (error: any) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, []);

    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" />
                <Text>Chargement des événements...</Text>
            </View>
        );
    }

    if (!events.length) {
        return (
            <View style={styles.container}>
                <Text>Aucun événement trouvé</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Événements de l’agenda Local</Text>
            <FlatList
                data={events}
                keyExtractor={(item:any) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>{item.title}</Text>
                        <Text>{formatDate(item.startDate)} - {formatDate(item.endDate)}</Text>
                        {item.location && <Text>Lieu : {item.location}</Text>}
                        {item.notes && <Text>Notes : {item.notes}</Text>}
                    </View>
                )}
            />
        </View>
    );
}
