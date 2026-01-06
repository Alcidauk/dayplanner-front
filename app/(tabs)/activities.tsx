import {useState, useEffect} from "react";
import {View, Text, FlatList, Button, Platform, ActivityIndicator, TextInput}
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
    const MOCK_ACTIVITIES: Activity[] = [
        {
            id: 1,
            title: "Cours de yoga en plein air",
            description: "Séance de yoga tous niveaux dans un parc",
            duration: "1 heure",
            location: "Parc Monceau, Paris",
        },
        {
            id: 2,
            title: "Concert jazz",
            description: "Concert live avec un groupe local",
            duration: "2 heures",
            location: "New Morning, Paris",
        },
        {
            id: 3,
            title: "Exposition photo",
            description: "Exposition de photographies contemporaines",
            duration: "1 heure",
            location: "Galerie 13, Paris",
        },
    ];

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
                data={MOCK_ACTIVITIES} //{activities}
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
            {showPicker && selectedActivity && (
            <View>
            {Platform.OS !== "web" && (
                <DateTimePicker
                    value={startDate}
                    mode="datetime"
                    display="default"
                    onChange={onChangeDate}
                />
            )}

            {Platform.OS === "web" && (
                <View>
                    <Text>Sélectionner la date et l’heure</Text>
                    <input
                        type="datetime-local"
                        value={formatLocalDatetime(startDate)}
                        onChange={(e) => setStartDate(new Date(e.target.value))}
                    />
                </View>
            )}
                <Button title="Confirmer" onPress={confirmAddEvent}/>
            </View>
            )}

        </View>
    );
}


