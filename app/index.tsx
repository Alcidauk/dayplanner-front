import {Text, View, Button, Linking} from "react-native";
import { Link } from 'expo-router';
import styles from "@/styles/styles";
import {API_URL} from "@/constants/constants";

const handleGoogleLogin = async () => {
    const url = `${API_URL}/auth/google/login`;
    await Linking.openURL(url);
};

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
            <Link href="/user-info" style={styles.link}>
                Go to User Info screen
            </Link>
            <Link href="/activities" style={styles.link}>
                Go to Activity screen
            </Link>

            <Button title="Se connecter avec Google" onPress={handleGoogleLogin} />
        </View>
    );
}
