import { Text, View } from 'react-native';
import { Link } from 'expo-router';
import styles from "@/styles/styles";


export default function AboutScreen() {
    return (
        <View style={styles.container}>
            <Text>About Dayplanner Front</Text>
            <Link href="/" style={styles.button}>
                Go to Home screen
            </Link>
        </View>
    );
}
