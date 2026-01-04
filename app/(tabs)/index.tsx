import {Text, View, Button, Linking} from "react-native";
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
            <Button title="Se connecter avec Google" onPress={handleGoogleLogin} />
        </View>
    );
}
