import {useEffect} from "react";
import {View, ActivityIndicator} from "react-native";
import styles from "@/styles/styles";
import {logout} from "@/api/authAPi";

export default function LogoutScreen() {
    useEffect(() => {
        logout();
    }, []);

    return (
        <View style={styles.container}>
            <ActivityIndicator size="large"/>
        </View>
    );
}
