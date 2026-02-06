import {ActivityIndicator, Text, View} from "react-native";
import styles from "@/styles/styles";


export default function LoadingView () {
    return (
        <View style={styles.container}>
            <ActivityIndicator size="large"/>
            <Text>Chargement en cours ... </Text>
        </View>
    )
}
