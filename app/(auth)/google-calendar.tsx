import {useState} from "react";
import { View, Text, FlatList } from "react-native";
import { getGoogleCalendarEvents } from "@/api/calendarApi";
import styles from "@/styles/styles";
import {formatDate, handleErrorMessages, reloadPageData} from "@/utils/utils";
import LoadingView from "@/components/loading_view";
import NoDataView from "@/components/no_data_view";
import {showAlert} from "@/utils/alertManager";
import {CalendarEvent} from "@/api/types";

export default function CalendarScreen() {
    const [events, setEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchEvents = async () => {
        try {
            const response: CalendarEvent[] = await getGoogleCalendarEvents();
            setEvents(response);
        } catch (error: unknown) {
            let message: string = handleErrorMessages(error)
            showAlert("error", "Erreur", message);
        } finally {
            setLoading(false);
        }
    };
    reloadPageData(fetchEvents)

    if (loading) {
        return <LoadingView/>
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Événements de l’agenda Google</Text>
            {events.length ? (
                <>
            <FlatList
                data={events}
                keyExtractor={(item: CalendarEvent) => item.id}
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
                </>
            ) : (<NoDataView/>)}
        </View>
)}
