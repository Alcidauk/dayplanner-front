import {useState, useEffect} from "react";
import {View, Text, FlatList, Platform, Modal, TextInput}
    from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import {addActivities, getActivitiesFromDB, getActivitiesRecommendations} from "@/api/activityApi";
import {addEventToGoogleCalendar} from "@/api/calendarApi";
import styles from "@/styles/styles";
import {Activity, ActivityListResponse} from "@/api/types";
import {addEventToLocalCalendar} from "@/utils/localCalendar";
import AppButton from "@/components/app_button";
import LoadingView from "@/components/loading_view";
import NoDataView from "@/components/no_data_view";
import {showAlert} from "@/utils/alertManager";
import {handleErrorMessages} from "@/utils/utils";


export default function ActivitiesScreen() {
    const [activities, setActivities] = useState<Activity[]>([]);
    const [activitiesFromDB, setActivitiesFromDB] = useState<Activity[]>([]);
    const [loading, setLoading] = useState(false);
    const [showPicker, setShowPicker] = useState(false);
    const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
    const [startDate, setStartDate] = useState<Date>(new Date());
    const [calendarTarget, setCalendarTarget] = useState<"google" | "local" | null>(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newActivity, setNewActivity] = useState<Partial<Activity>>({
        title: "",
        description: "",
        location: "",
        duration: "1 heure"
    });

    const handleAddToCalendar = (activity: Activity, target: "google" | "local" | null) => {
        setSelectedActivity(activity);
        if (!startDate) setStartDate(new Date());
        setCalendarTarget(target);
        setShowPicker(true);
    };
    const fetchActivities = async () => {
        try {
            setLoading(true);
            const data = await getActivitiesRecommendations();
            setActivities(data ?? []);
        } catch (e: any) {
            const message = e?.response?.data?.detail
            showAlert("error", "Erreur", `Impossible de charger les activités: ${message}`);
        } finally {
            setLoading(false);
        }
    };

    const createActivity = async () => {
        if (!newActivity.title?.trim()) {
            showAlert("error", "Erreur", "Le titre est requis");
            return;
        }
        if (!newActivity.description?.trim()) {
            showAlert("error", "Erreur", "La description est requise");
            return;
        }

        try {
            const activityToAdd: Activity = {
                id: Date.now(),
                title: newActivity.title.trim(),
                description: newActivity.description.trim(),
                location: newActivity.location?.trim() || "",
                duration: newActivity.duration || "1 heure"
            };
            setActivities(prev => [activityToAdd, ...prev]);
            try {
                console.log("activity:", activityToAdd)
                await addActivities(activityToAdd)
            } catch (error: unknown) {
                let message = handleErrorMessages(error)
                showAlert('error', "Erreur", message)
            }
            setNewActivity({
                title: "",
                description: "",
                location: "",
                duration: "1 heure"
            });
            setShowCreateModal(false);
            showAlert("success", "Succès", "Activité créée avec succès");

        } catch (error: any) {
            let message = handleErrorMessages(error)
            showAlert("error", "Erreur", message);
        }
    };

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

    useEffect(() => {
        const fetchActivitiesFromDB = async () => {
            const DBactivities: any = await getActivitiesFromDB();
            setActivitiesFromDB(DBactivities)
        }
        fetchActivitiesFromDB()
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Activités recommandées</Text>
            <AppButton
                title="Me recommander des activités"
                onPress={() => fetchActivities()}
            />
            <View>
                <AppButton
                    title="Créer une nouvelle activité"
                    onPress={() => setShowCreateModal(true)}
                />
            </View>
            {(activities?.length || activitiesFromDB?.length) ? (
                <>
                    <FlatList
                        data={[...(activities || []), ...(activitiesFromDB || [])]}
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

            <Modal
                visible={showCreateModal}
                transparent
                animationType="fade"
                onRequestClose={() => setShowCreateModal(false)}
            >
                <View style={styles.overlay}>
                    <View style={[styles.card, styles.modalContainer]}>
                        <Text style={styles.cardTitle}>Créer une nouvelle activité</Text>

                        <Text style={styles.label}>Titre *</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Ex: Randonnée en montagne"
                            value={newActivity.title}
                            onChangeText={(text) => setNewActivity(prev => ({...prev, title: text}))}
                        />

                        <Text style={styles.label}>Description *</Text>
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            placeholder="Décrivez l'activité..."
                            value={newActivity.description}
                            onChangeText={(text) => setNewActivity(prev => ({...prev, description: text}))}
                            multiline
                            numberOfLines={4}
                        />

                        <Text style={styles.label}>Lieu</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Ex: Parc National des Pyrénées"
                            value={newActivity.location}
                            onChangeText={(text) => setNewActivity(prev => ({...prev, location: text}))}
                        />

                        <Text style={styles.label}>Durée</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Ex: 2 heures, 1 journée"
                            value={newActivity.duration}
                            onChangeText={(text) => setNewActivity(prev => ({...prev, duration: text}))}
                        />

                        <View style={styles.buttonContainer}>
                            <AppButton
                                title="Annuler"
                                onPress={() => {
                                    setShowCreateModal(false);
                                    setNewActivity({
                                        title: "",
                                        description: "",
                                        location: "",
                                        duration: "1 heure"
                                    });
                                }}
                            />
                            <AppButton
                                title="Créer"
                                onPress={createActivity}
                            />
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}


