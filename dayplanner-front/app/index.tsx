import { Text, View } from "react-native";
import { Link } from 'expo-router';
import styles from "@/styles/styles";

export default function Index() {
    return (
        <View style={styles.container}>
            <Text>Dayplanner Front</Text>
            <Link href="/about" style={styles.button}>
                Go to About screen
            </Link>
        </View>
    );
}
