import { Pressable, Text } from "react-native";
import styles from "@/styles/styles";

interface Props {
    title: string;
    onPress: () => void;
    variant?: "primary" | "secondary";
}

export default function AppButton({
                                      title,
                                      onPress,
                                  }: Props) {
    return (
        <Pressable
            onPress={onPress}
            style={({ pressed }) => [
                styles.button,
                pressed && { opacity: 0.7 },
            ]}
        >
            <Text style={styles.button_text}>{title}</Text>
        </Pressable>
    );
}
