import {useState, useEffect} from "react";
import {View, Text, FlatList, Platform, Modal}
    from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import {getActivities} from "@/api/activityApi";
import {addEventToGoogleCalendar} from "@/api/calendarApi";
import styles from "@/styles/styles";
import {Activity} from "@/api/types";
import {addEventToLocalCalendar} from "@/utils/localCalendar";
import AppButton from "@/components/app_button";
import LoadingView from "@/components/loading_view";
import NoDataView from "@/components/no_data_view";
import {showAlert} from "@/utils/alertManager";


export default function ActivitiesScreen() {
    const [activities, setActivities] = useState<Activity[]>([]);
    const [loading, setLoading] = useState(true);
    const [showPicker, setShowPicker] = useState(false);
    const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
    const [startDate, setStartDate] = useState<Date>(new Date());
    const [calendarTarget, setCalendarTarget] = useState<"google" | "local" | null>(null);


    const handleAddToCalendar = (activity: Activity, target: "google" | "local" | null) => {
        setSelectedActivity(activity);
        if (!startDate) setStartDate(new Date());
        setCalendarTarget(target);
        setShowPicker(true);
    };

    useEffect(() => {
        const fetchActivities = async () => {
            try {
                const data = await getActivities();
                setActivities(data ?? []);
            } catch (e: any) {
                const message = e?.response?.data?.detail
                showAlert("error", "Erreur", `Impossible de charger les activités: ${message}`);
            } finally {
                setLoading(false);
            }
        };
        fetchActivities();
        setActivities([])
        console.log(activities)

    }, []);

    const confirmAddEvent = async (selectedStartDate: Date) => {
        if (!selectedActivity || !calendarTarget) {
            showAlert("error", "Erreur", "Infos manquantes");
            return;
        }

        let durationHours = 1;
        const match = selectedActivity.duration?.match(/(\d+)/);
        if (match) durationHours = parseInt(match[1], 10);

        const endDate = new Date(selectedStartDate.getTime() + durationHours * 3600000);

        try {
            if (calendarTarget === "google") {
                await addEventToGoogleCalendar({
                    id: selectedActivity.id,
                    summary: selectedActivity.title,
                    description: selectedActivity.description,
                    location: selectedActivity.location,
                    start: selectedStartDate.toISOString(),
                    end: endDate.toISOString(),
                    source: "google"
                });

                showAlert("success", "Succès", "Événement ajouté à Google Agenda ");

            } else if (calendarTarget === "local") {
                await addEventToLocalCalendar({
                    title: selectedActivity.title,
                    description: selectedActivity.description,
                    location: selectedActivity.location,
                    startDate: selectedStartDate,
                    endDate: endDate,
                });
                if (Platform.OS === "web") {
                    showAlert("error","erreur", "Agenda local non disponible sur le web");
                    return;
                }
                showAlert("success", "Succès", "Événement ajouté à l'agenda du téléphone");
            }
        } catch (e: any) {
            showAlert("error",
                "Erreur",
                e?.message || "Impossible d'ajouter l'événement"
            );
        } finally {
            setShowPicker(false);
            setSelectedActivity(null);
            setCalendarTarget(null);
        }
    };

    const formatLocalDatetime = (date: Date) => {
        const pad = (n: number) => n.toString().padStart(2, "0");
        return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
    };
    if (loading) {
        return <LoadingView/>
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Activités recommandées</Text>
            {activities.length ? (
                <>
                    <FlatList
                        data={activities}
                        keyExtractor={(_, i) => i.toString()}
                        renderItem={({item}) => (
                            <View style={styles.card}>
                                <Text style={styles.cardTitle}>{item.title}</Text>
                                <Text>{item.description}</Text>
                                {item.duration && <Text>Durée : {item.duration}</Text>}
                                {item.location && <Text>Lieu : {item.location}</Text>}
                                <AppButton
                                    title="Ajouter à l'agenda Google"
                                    onPress={() => handleAddToCalendar(item, 'google')}
                                />
                                <AppButton
                                    title="Ajouter à l'agenda local"
                                    onPress={() => handleAddToCalendar(item, 'local')}
                                />
                            </View>
                        )}
                    />
                </>
            ) : (<NoDataView/>)}

            <Modal
                visible={showPicker}
                transparent
                animationType="fade"
                onRequestClose={() => setShowPicker(false)}
            >
                <View style={styles.overlay}>
                    <View
                        style={styles.card}
                    >
                        <Text style={styles.cardTitle}>
                            Ajouter à : {calendarTarget === "google" ? "Google Agenda" : "Agenda du téléphone"}
                        </Text>
                        <Text style={styles.text}>
                            Choisir la date et l’heure
                        </Text>
                        {Platform.OS !== "web" && (
                            <DateTimePickerModal
                                isVisible={showPicker}
                                mode="datetime"
                                onConfirm={(date) => {
                                    setShowPicker(false);
                                    confirmAddEvent(date);
                                }}
                                onCancel={() => setShowPicker(false)}
                            />
                        )}
                        {Platform.OS === "web" && (
                            <input
                                type="datetime-local"
                                value={formatLocalDatetime(startDate)}
                                onChange={(e) => {
                                    const [d, t] = e.target.value.split("T");
                                    const [y, m, day] = d.split("-").map(Number);
                                    const [h, min] = t.split(":").map(Number);
                                    setStartDate(new Date(y, m - 1, day, h, min));
                                }}
                                style={styles.input}
                            />
                        )}
                        <View style={styles.buttonContainer}>
                            <AppButton
                                title="Annuler"
                                onPress={() => setShowPicker(false)}
                            />
                            <AppButton
                                title="Confirmer"
                                onPress={() => confirmAddEvent(startDate)}
                            />
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}


