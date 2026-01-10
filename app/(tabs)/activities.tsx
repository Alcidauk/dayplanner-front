import {useState, useEffect} from "react";
import {View, Text, FlatList, Button, Platform, ActivityIndicator, TextInput, Modal}
    from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import {showAlert} from "@/utils/utils";
import {getActivities} from "@/api/activityApi";
import {addEventToCalendar} from "@/api/calendarApi";
import styles from "@/styles/styles";
import {Activity} from "@/api/types";

export default function ActivitiesScreen() {
    const [activities, setActivities] = useState<Activity[]>([]);
    const [loading, setLoading] = useState(true);
    const [showPicker, setShowPicker] = useState(false);
    const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
    const [startDate, setStartDate] = useState<Date>(new Date());

    useEffect(() => {
        const fetchActivities = async () => {
            try {
                const data = await getActivities();
                setActivities(data ?? []);
            } catch (e: any) {
                const message = e?.response?.data?.detail
                showAlert("Erreur", `Impossible de charger les activités: ${message}`);
            } finally {
                setLoading(false);
            }
        };
        fetchActivities();
    }, []);

    const onChangeDate = (event: any, date?: Date) => {
        if (date) {
            setStartDate(date);
        }
        setShowPicker(Platform.OS === "ios");
    };

    const handleAddToCalendar = (activity: Activity) => {
        setSelectedActivity(activity);
        if (!startDate) setStartDate(new Date());
        setShowPicker(true);
    };

    const confirmAddEvent = async () => {
        if (!selectedActivity) return;

        let durationHours = 1;
        const match = selectedActivity.duration?.match(/(\d+)/);
        if (match) {
            durationHours = parseInt(match[1], 10);
        }

        const endDate = new Date(startDate.getTime() + durationHours * 60 * 60 * 1000);
        const selectedActivityBody = {
            id: selectedActivity.id,
            summary: selectedActivity.title,
            description: selectedActivity.description,
            location: selectedActivity.location,
            start: startDate.toISOString(),
            end: endDate.toISOString(),
        };

        try {
            await addEventToCalendar(selectedActivityBody);
            showAlert("Succès", "Événement ajouté au calendrier !");
        } catch (e: any) {
            const message = e?.response?.data?.detail
            showAlert("Erreur", `Impossible d'ajouter l'événement au calendrier: ${message}`);
        } finally {
            setShowPicker(false);
            setSelectedActivity(null);
        }
    };
    const formatLocalDatetime = (date: Date) => {
        const pad = (n: number) => n.toString().padStart(2, "0");
        return `${date.getFullYear()}-${pad(date.getMonth()+1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
    };
    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large"/>
                <Text>Chargement des activités...</Text>
            </View>
        );
    }
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Activités recommandées</Text>
            <FlatList
                data={activities} //{MOCK_ACTIVITIES}
                keyExtractor={(_, i) => i.toString()}
                renderItem={({item}) => (
                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>{item.title}</Text>
                        <Text>{item.description}</Text>
                        {item.duration && <Text>Durée : {item.duration}</Text>}
                        {item.location && <Text>Lieu : {item.location}</Text>}
                        <Button
                            title="Ajouter à l'agenda"
                            onPress={() => handleAddToCalendar(item)}
                        />
                    </View>
                )}
            />
            <Modal
                visible={showPicker}
                transparent
                animationType="slide"
                onRequestClose={() => setShowPicker(false)}
            >
                <View
                    style={{
                        flex: 1,
                        backgroundColor: "rgba(0,0,0,0.4)",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <View
                        style={{
                            backgroundColor: "white",
                            padding: 20,
                            borderRadius: 12,
                            width: "100%",
                            maxWidth: 400,
                        }}
                    >
                        <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 10 }}>
                            Choisir la date et l’heure
                        </Text>
                        {Platform.OS !== "web" && (
                            <DateTimePicker
                                value={startDate}
                                mode="datetime"
                                display="default"
                                onChange={onChangeDate}
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
                                style={{
                                    width: "100%",
                                    padding: 10,
                                    marginBottom: 16,
                                }}
                            />
                        )}
                        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                            <Button
                                title="Annuler"
                                color="gray"
                                onPress={() => setShowPicker(false)}
                            />
                            <Button
                                title="Confirmer"
                                onPress={confirmAddEvent}
                            />
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}


