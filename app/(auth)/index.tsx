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

export default function TodayDashboard() {
    const router = useRouter();
    const { getToken } = useAuth();

    const [loading, setLoading] = useState(true);
    const [googleEvents, setGoogleEvents] = useState<any[]>([]);
    const [localEvents, setLocalEvents] = useState<any[]>([]);
    const [user, setUser] = useState<{ name: string, email: string, surname: string, google_account_id: string |null } | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const token = await getToken();
                if (token) {
                    const user: UserResponse = await getCurrentUser()
                    setUser({ name: user.name,
                    email: user.email,
                    surname: user.surname,
                    google_account_id: user.google_account_id});
                }
                const today = new Date();
                if (user && user.google_account_id) {
                    const googleData = await getGoogleCalendarEvents(today);
                    setGoogleEvents(googleData);
                } else {
                    const googleData: CalendarEvent[] = [];
                    setGoogleEvents(googleData);
                }
                if (user && Platform.OS !== 'web') {
                    const localData: any[] = await getLocalCalendarEvents(today);
                    setLocalEvents(localData);
                } else {
                    const localData: any[] = [];
                    setLocalEvents(localData);
                }
            } catch (error) {
                let message = handleErrorMessages(error);
                showAlert('error', "Erreur", message);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const renderEvent = (event: any, isLocal = false) => {
        const startTime = isLocal ? formatDate(event.startDate) : formatDate(event.start);
        const isSoon =
            new Date(startTime).getTime() - new Date().getTime() < 3600_000;
        return (
            <View
                key={event.id}
                style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginVertical: 4,
                    padding: 6,
                    backgroundColor: isSoon ? "#c51313" : "#000",
                    borderRadius: 8,
                }}
            >
                <Text style={styles.cardTitle}>
                    {event.summary || event.title}
                </Text>
                <Text style={{ fontWeight: "bold", color: isSoon ? "red" : "#333" }}>
                    {startTime}
                </Text>
            </View>

        );
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>
                Bonjour {user?.name ?? "Utilisateur"}
            </Text>
            <Text style={styles.text}>
                Voici ton tableau de bord du jour
            </Text>

            <View
                style={styles.card}
            >
                <Text style={styles.cardTitle}>
                    Google Agenda
                </Text>
                {loading && <Text style={styles.whiteText}>Chargement…</Text>}
                {!loading && googleEvents.length === 0 && (
                    <Text style={styles.whiteText}>Aucun événement prévu aujourd’hui</Text>
                )}
                {!loading && googleEvents.length > 0 &&
                    googleEvents.map((e) => renderEvent(e))}
                <AppButton
                    title="Voir mon agenda Google"
                    onPress={() => router.push("/google-calendar")}
                />
            </View>

            <View
                style={styles.card}
            >
                <Text  style={styles.cardTitle}>
                    Agenda local
                </Text>
                {loading && <Text style={styles.whiteText}>Chargement…</Text>}
                {!loading && localEvents.length === 0 && (
                    <Text style={styles.whiteText}>Aucun événement prévu aujourd’hui</Text>
                )}
                {!loading && localEvents.length > 0 &&
                    localEvents.map((e) => renderEvent(e, true))}
                <AppButton
                    title="Voir mon agenda local"
                    onPress={() => router.push("/local-calendar")}
                />
            </View>

            <View style={styles.buttonContainer}>
                <AppButton
                    title="Ajouter une activité"
                    onPress={() => router.push("/activities")}
                />
            </View>
        </ScrollView>
    );
}
