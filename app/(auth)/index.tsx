import {Button, Text, View} from "react-native";
import styles from "@/styles/styles";
import {useAuth} from "@/hooks/useAuth";
import {Redirect, useRouter} from "expo-router";
import {useEffect, useState} from "react";
import {CalendarEvent, UserResponse} from "@/api/types";
import {getCurrentUser} from "@/api/userApi";
import {getGoogleCalendarEvents} from "@/api/calendarApi";
import {formatDate} from "@/utils/utils";
import {getLocalCalendarEvents} from "@/utils/localCalendar";



export default function Index() {
    const {isAuthenticated} = useAuth();
    const router = useRouter();
    const [user, setUser] = useState<UserResponse | null>(null);
    const [googleEvents, setGoogleEvents] = useState<CalendarEvent[]>([]);
    const [localEvents, setLocalEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!isAuthenticated) return;

        getCurrentUser()
            .then(setUser)
            .catch(console.error);
        getGoogleCalendarEvents(new Date())
            .then(setGoogleEvents)
            .catch(console.error)
        getLocalCalendarEvents(new Date())
            .then(setLocalEvents)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [isAuthenticated]);

    if (!isAuthenticated) {
        return <Redirect href="/(public)" />;
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Bonjour {user?.name}</Text>
            <Text style={styles.text}>Voici ton résumé du jour</Text>
            <Text style={styles.cardTitle}>Aujourd’hui</Text>

            <View style={styles.card}>
                <Text style={styles.cardTitle}>Calendrier google</Text>
                {loading && <Text>Chargement…</Text>}
                {!loading && googleEvents.length === 0 && (
                    <Text> Aucun événement prévu aujourd’hui</Text>
                )}
                {!loading && googleEvents.length > 0 && (
                    googleEvents.map(event => (
                        <Text key={event.id}>
                            {event.summary} – {formatDate(event.start)}
                        </Text>
                    ))
                )}
                <Button title="Voir mon agenda Google" onPress={() => router.push("/google-calendar")} />
            </View>
            <View style={styles.card}>
                <Text style={styles.cardTitle}>Calendrier local</Text>
                {loading && <Text>Chargement…</Text>}
                {!loading && localEvents.length === 0 && (
                    <Text> Aucun événement prévu aujourd’hui</Text>
                )}
                {!loading && localEvents.length > 0 && (
                    localEvents.map(event => (
                        <Text key={event.id}>
                            {event.title} – {formatDate(event.startDate)}
                        </Text>
                    ))
                )}
                <Button title="Voir mon agenda local" onPress={() => router.push("/local-calendar")} />
            </View>
            <View style={styles.card}>
                <Button title="Ajouter une activité" onPress={() => router.push("/activities")} />
            </View>
        </View>
    );
}

