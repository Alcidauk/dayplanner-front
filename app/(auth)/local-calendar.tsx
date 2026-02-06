import { useEffect, useState } from "react";
import { View, Text, FlatList, ActivityIndicator } from "react-native";
import styles from "@/styles/styles";
import {getLocalCalendarEvents} from "@/utils/localCalendar";
import {formatDate, redirectHome} from "@/utils/utils";
import LoadingView from "@/components/loading_view";
import NoDataView from "@/components/no_data_view";

export default function LocalCalendarScreen() {
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
        return <LoadingView/>
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Événements de l’agenda Local</Text>
            {events.length ? (
                <>
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
                </>
            ) : (<NoDataView/>)}
        </View>
    );
}
