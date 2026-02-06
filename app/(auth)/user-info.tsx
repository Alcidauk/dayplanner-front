import {useEffect, useState} from "react";
import {Text, TextInput, Button, ScrollView, View, FlatList} from "react-native";
import {addUserInfo, getUserInfo} from "@/api/userInfoApi";
import {redirectHome, showAlert} from "@/utils/utils";
import styles from "@/styles/styles";
import {UserInfoResponse} from "@/api/types";
import AppButton from "@/components/app_button";

export default function UserInfo() {
    const [place, setPlace] = useState("");
    const [interests, setInterests] = useState("");
    const [userInfo, setUserInfo] = useState<UserInfoResponse | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
    const fetchUserInfo = async () => {
        try {
            const data = await getUserInfo();
            setUserInfo(data ?? []);
        } catch (e: any) {
            const message = e?.response?.data?.detail
            showAlert("Erreur", `Impossible de charger les infos utilisateur: ${message}`);
        } finally {
            setLoading(false);
        }
    };
    fetchUserInfo();
    }, []);

    const handleSubmit = async () => {
        if (!place || !interests) {
            showAlert("Erreur", "Tous les champs sont obligatoires");
            return;
        }

        setLoading(true);
        try {
            const data = {
                place,
                interests: interests.split(",").map((i) => i.trim()),
            };
            const response = await addUserInfo(data);
            showAlert("Succès", "Informations mises à jour !");
        } catch (error: any) {
            showAlert("Erreur", error.response?.data?.detail || "Erreur serveur");
        } finally {
            setLoading(false);
        }
        redirectHome()
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Vos informations</Text>
            {userInfo ? (
                <>
                    <Text style={styles.title}>Lieu :</Text>
                    <Text style={styles.card}>{userInfo.place}</Text>
                    <Text style={styles.title}>Centres d’intérêt :</Text>
                    <FlatList
                        data={userInfo.interests}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item }) => <Text style={styles.card}>• {item}</Text>}
                    />
                </>
            ) : (
                <Text>Aucune information disponible</Text>
            )}
            <Text style={styles.title}>Nouveau Lieu :</Text>
            <TextInput
                style={styles.input}
                placeholder="Lieu"
                value={place}
                onChangeText={setPlace}
            />
            <Text style={styles.title}>Nouveaux Centres d’intérêt :</Text>
            <TextInput
                style={styles.input}
                placeholder="Centres d'intérêt (séparés par des virgules)"
                value={interests}
                onChangeText={setInterests}
                multiline={true}
                numberOfLines={2}
            />

            <AppButton
                title={loading ? "Enregistrement..." : "Enregistrer"}
                onPress={handleSubmit}
            />
        </ScrollView>
    );
}
