import {Text, View} from "react-native";
import styles from "@/styles/styles";
import {useAuth} from "@/hooks/useAuth";
import {Redirect} from "expo-router";

export default function Index() {
    const {isAuthenticated} = useAuth();
    if (!isAuthenticated) {
        return <Redirect href="/(public)"/>;
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Dayplanner Front</Text>
            <Text style={styles.title}>Welcome</Text>
        </View>
    );
}
