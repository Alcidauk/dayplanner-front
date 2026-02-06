import {Text, View} from "react-native";
import styles from "@/styles/styles";

export default function NoDataView() {
    return (
        <View style={styles.container}>
            <Text>Aucun élément trouvé</Text>
        </View>
    )
}
