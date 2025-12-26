import { Text, View } from 'react-native';
import { Link } from 'expo-router';
import styles from "@/styles/styles";


export default function AboutScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>About Dayplanner Front</Text>
            <Link href="/" style={styles.button}>
                Go to Home screen
            </Link>
            <Link href="/register" style={styles.button}>
                Go to Register screen
            </Link>
        </View>
    );
}
