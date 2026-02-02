import { View, Text, ScrollView, StyleSheet } from "react-native";
import styles from "@/styles/styles";

export default function AboutScreen() {

    return (
        <ScrollView contentContainerStyle={styles.container}>

            <Text style={styles.title}>DayPlanner</Text>
            <Text style={styles.subtitle}>
                Organisez votre journée simplement
            </Text>

            <View style={styles.card}>
                <Text style={styles.cardTitle}>À propos</Text>
                <Text style={styles.text}>
                    DayPlanner est une application qui centralise vos agendas
                    et vous aide à planifier vos activités quotidiennes.
                </Text>
            </View>

            <View style={styles.card}>
                <Text style={styles.cardTitle}>Fonctionnalités</Text>
                <Text style={styles.feature}>Google Agenda</Text>
                <Text style={styles.feature}>Agenda Android local</Text>
                <Text style={styles.feature}>Suggestions d’activités</Text>
            </View>

            <View style={styles.card}>
                <Text style={styles.cardTitle}>🔒 Confidentialité</Text>
                <Text style={styles.text}>
                    Vos données ne sont jamais partagées et sont utilisées uniquement
                    pour le fonctionnement de l’application.
                </Text>
            </View>

            <Text style={styles.footer}>
                Version 1.0.0
            </Text>
        </ScrollView>
    );
}
