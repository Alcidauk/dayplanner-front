import {useState, useCallback} from "react";
import {Text, TextInput, View, FlatList, TouchableOpacity} from "react-native";
import {getUserInfo, addInterest, removeInterest, updatePlace, addUserInfo} from "@/api/userInfoApi";
import {handleErrorMessages} from "@/utils/utils";
import styles from "@/styles/styles";
import {UserInfoResponse} from "@/api/types";
import AppButton from "@/components/app_button";
import {showAlert} from "@/utils/alertManager";
import {useFocusEffect} from "@react-navigation/native";

export default function UserInfo() {
    const [place, setPlace] = useState("");
    const [newInterest, setNewInterest] = useState("");
    const [userInfo, setUserInfo] = useState<UserInfoResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [hasUserInfo, setHasUserInfo] = useState(false);

    const fetchUserInfo = useCallback(async () => {
        try {
            const data = await getUserInfo();
            setUserInfo(data);
            setPlace(data?.place || "");
            setHasUserInfo(true);
        } catch (error: any) {
            if (error?.response?.status === 404) {
                setHasUserInfo(false);
            } else {
                let message: string = handleErrorMessages(error);
                showAlert('error', 'Erreur', message);
            }
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
            fetchUserInfo();
        }, [fetchUserInfo])
    );

    const handleAddInterest = async () => {
        const trimmedInterest = newInterest.trim();

        if (!trimmedInterest) {
            showAlert("error", "Erreur", "Veuillez entrer un centre d'intérêt");
            return;
        }
        setLoading(true);
        try {
            const updated = await addInterest(trimmedInterest);
            setUserInfo(updated);
            setNewInterest("");
            showAlert("success", "Succès", "Centre d'intérêt ajouté !");
        } catch (error: any) {
            let message: string = handleErrorMessages(error);
            showAlert("error", "Erreur", message);
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveInterest = async (interest: string) => {
        setLoading(true);
        try {
            const updated = await removeInterest(interest);
            setUserInfo(updated);
            showAlert("success", "Succès", "Centre d'intérêt retiré !");
        } catch (error: any) {
            let message: string = handleErrorMessages(error);
            showAlert("error", "Erreur", message);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdatePlace = async () => {
        if (!place.trim()) {
            showAlert("error", "Erreur", "Le lieu est obligatoire");
            return;
        }

        setLoading(true);
        try {
            const updated = await updatePlace(place.trim());
            setUserInfo(updated);
            showAlert("success", "Succès", "Lieu mis à jour !");
        } catch (error: any) {
            let message: string = handleErrorMessages(error);
            showAlert("error", "Erreur", message);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateInitial = async () => {
        if (!place.trim()) {
            showAlert("error", "Erreur", "Le lieu est obligatoire");
            return;
        }

        setLoading(true);
        try {
            const data = await addUserInfo({
                place: place.trim(),
                interests: []
            });
            setUserInfo(data);
            setHasUserInfo(true);
            showAlert("success", "Succès", "Informations créées !");
        } catch (error: any) {
            let message: string = handleErrorMessages(error);
            showAlert("error", "Erreur", message);
        } finally {
            setLoading(false);
        }
    };

    if (!hasUserInfo) {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>Créer vos informations</Text>
                <Text style={styles.label}>Lieu :</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Entrez votre lieu"
                    value={place}
                    onChangeText={setPlace}
                />
                <AppButton
                    title={loading ? "Création..." : "Créer"}
                    onPress={handleCreateInitial}
                    disabled={loading}
                />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Vos informations</Text>
            <Text style={styles.title}>Lieu :</Text>
            <Text style={styles.card}>{userInfo?.place || "Non défini"}</Text>
            <Text style={styles.title}>Modifier le lieu :</Text>
            <View style={styles.flatContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Nouveau lieu"
                    value={place}
                    onChangeText={setPlace}
                />
                <TouchableOpacity
                    onPress={handleUpdatePlace}
                    style={styles.button}
                    disabled={loading}
                >
                    <Text style={styles.button_text}>✓</Text>
                </TouchableOpacity>
            </View>

            <Text style={styles.title}>Centres d'intérêt :</Text>
            {userInfo?.interests && userInfo.interests.length > 0 ? (
                <FlatList style={styles.interestsList}
                          data={userInfo.interests}
                          keyExtractor={(item, index) => index.toString()}
                          renderItem={({item}) => (
                              <View style={styles.interestItem}>
                                  <Text style={styles.card}>{item}</Text>
                                  <TouchableOpacity
                                      onPress={() => handleRemoveInterest(item)}
                                      style={styles.removeButton}
                                      disabled={loading}
                                  >
                                      <Text style={styles.button_text}>✕</Text>
                                  </TouchableOpacity>
                              </View>
                          )}
                />
            ) : (
                <Text style={styles.noData}>Aucun centre d'intérêt enregistré</Text>
            )}

            <Text style={styles.title}>Ajouter un centre d'intérêt :</Text>
            <View style={styles.flatContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Ex: Sport, Musique, Lecture..."
                    value={newInterest}
                    onChangeText={setNewInterest}
                    onSubmitEditing={handleAddInterest}
                    returnKeyType="done"
                />
                <TouchableOpacity
                    onPress={handleAddInterest}
                    style={styles.addButton}
                    disabled={loading}
                >
                    <Text style={styles.button_text}>+</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
