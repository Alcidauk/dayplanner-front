import { Pressable, Text } from "react-native";
import styles from "@/styles/styles";

interface Props {
    title: string;
    onPress: () => void;
    disabled: boolean;
    variant?: "primary" | "secondary";
}

export default function AppButton({
                                      title,
                                      onPress,
                                      disabled
                                  }: Props) {
    return (
        <Pressable
            onPress={onPress}
            disabled={disabled}
            style={({ pressed }) => [
                styles.button,
                pressed && { opacity: 0.7 },
            ]}
        >
            <Text style={styles.button_text}>{title}</Text>
        </Pressable>
    );
}
