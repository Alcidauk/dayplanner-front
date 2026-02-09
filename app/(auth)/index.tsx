import {View, Text, ScrollView, Platform} from "react-native";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import AppButton from "@/components/app_button";
import { getGoogleCalendarEvents } from "@/api/calendarApi";
import { getLocalCalendarEvents } from "@/utils/localCalendar";
import {formatDate, handleErrorMessages} from "@/utils/utils";
import { useAuth } from "@/hooks/useAuth";
import styles from "@/styles/styles";
import {getCurrentUser} from "@/api/userApi";
import {CalendarEvent, UserResponse} from "@/api/types";
import {showAlert} from "@/utils/alertManager";

export default function Index() {
    const router = useRouter();
    const { getToken, isAuthenticated } = useAuth();

    const [loading, setLoading] = useState(true);
    const [googleEvents, setGoogleEvents] = useState<any[]>([]);
    const [localEvents, setLocalEvents] = useState<any[]>([]);
    const [user, setUser] = useState<{ name: string, surname:string, email:string, google_account_id:string |null} | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const token = await getToken();
                if (token) {
                    const user: UserResponse = await getCurrentUser()
                    setUser({
                        name: user.name,
                        surname: user.surname,
                        email: user.email,
                        google_account_id: user.google_account_id,
                    });
                }
                if (user && user.google_account_id) {
                    const googleData: CalendarEvent[] = await getGoogleCalendarEvents(new Date());
                    setGoogleEvents(googleData);
                } else {
                    const googleData: CalendarEvent[] = [];
                    setGoogleEvents(googleData);
                }
                if (user && Platform.OS !== 'web') {
                    const localData = await getLocalCalendarEvents(new Date());
                    setLocalEvents(localData);
                } else {
                    const localData: CalendarEvent[] = [];
                    setLocalEvents(localData);
                }
            } catch (error) {
                let message = handleErrorMessages(error)
                showAlert('error', "Erreur", message);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>
                Bonjour {user?.name ?? "Utilisateur"}
            </Text>
            <Text style={styles.text}>Voici ton résumé du jour</Text>

            <View style={styles.card}>
                <Text style={styles.cardTitle}>Calendrier Google</Text>
                {loading && <Text>Chargement…</Text>}
                {!loading && googleEvents.length === 0 && (
                    <Text>Aucun événement prévu aujourd’hui</Text>
                )}
                {!loading && googleEvents.length > 0 &&
                    googleEvents.map((event) => (
                        <Text key={event.id}>
                            {event.summary} – {formatDate(event.start)}
                        </Text>
                    ))}
                <AppButton
                    title="Voir mon agenda Google"
                    onPress={() => router.push("/google-calendar")}
                />
            </View>

            <View style={styles.card}>
                <Text style={styles.cardTitle}>Calendrier local</Text>
                {loading && <Text>Chargement…</Text>}
                {!loading && localEvents.length === 0 && (
                    <Text>Aucun événement prévu aujourd’hui</Text>
                )}
                {!loading && localEvents.length > 0 &&
                    localEvents.map((event) => (
                        <Text key={event.id}>
                            {event.title} – {formatDate(event.startDate)}
                        </Text>
                    ))}
                <AppButton
                    title="Voir mon agenda local"
                    onPress={() => router.push("/local-calendar")}
                />
            </View>

            <View style={styles.card}>
                <AppButton
                    title="Ajouter une activité"
                    onPress={() => router.push("/activities")}
                />
            </View>
        </ScrollView>
    );
}
