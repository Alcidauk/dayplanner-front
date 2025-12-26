import { Text, View } from "react-native";
import { Link } from 'expo-router';
import styles from "@/styles/styles";

export default function Index() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Dayplanner Front</Text>
            <Link href="/about" style={styles.link}>
                Go to About screen
            </Link>
            <Link href="/register" style={styles.link}>
                Go to Register screen
            </Link>
        </View>
    );
}
