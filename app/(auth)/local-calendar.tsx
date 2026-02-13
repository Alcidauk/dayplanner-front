import {useState} from "react";
import { View, Text, FlatList } from "react-native";
import styles from "@/styles/styles";
import {getLocalCalendarEvents} from "@/utils/localCalendar";
import {formatDate, handleErrorMessages, reloadPageData} from "@/utils/utils";
import LoadingView from "@/components/loading_view";
import NoDataView from "@/components/no_data_view";
import {showAlert} from "@/utils/alertManager";

export default function LocalCalendarScreen() {
    const [events, setEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchEvents = async () => {
        try {
            const data = await getLocalCalendarEvents();
            setEvents(data);
        } catch (error: any) {
            let message: string = handleErrorMessages(error)
            showAlert('error','Erreur', message);
            console.error(error);
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
