import { StyleSheet } from 'react-native';
import {Fonts} from "@/styles/theme";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
        textAlign: "center",
        fontFamily: Fonts.serif,
        color: "grey"
    },
    subtitle: {
        fontSize: 14,
        opacity: 0.7,
        marginBottom: 20,
    },
    text: {
        fontSize: 14,
        lineHeight: 20,
    },
    button: {
        paddingVertical: 14,
        paddingHorizontal: 24,
        borderRadius: 14,
        alignItems: "center",
        justifyContent: "center",
        marginVertical: 10,
        shadowColor: "#000",
        shadowOpacity: 0.15,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 4 },
        elevation: 4,
        backgroundColor: "#000"
    },
    button_text: {
        fontSize: 14,
        lineHeight: 20,
        color: "white",
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 12,
        marginBottom: 12,
        borderRadius: 6,
        backgroundColor: "#fff",
        boxShadow: "#000 0.05 4",
        elevation: 2,
    },
    link: {
        color: "blue",
        marginBottom: 20,
    },
    card: {
        backgroundColor: "#fff",
        padding: 16,
        borderRadius: 10,
        marginBottom: 12,
        boxShadow: "#000 0.05 4",
        elevation: 2,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: "600",
    },
    cardDescription: {
        marginTop: 6,
        color: "#555",
    },
    cardMeta: {
        marginTop: 8,
        fontSize: 12,
        color: "#888",
    },
    feature: {
        fontSize: 15,
        marginVertical: 2,
    },
    footer: {
        textAlign: "center",
        fontSize: 12,
        marginTop: 20,
        opacity: 0.6,
    },
    rowHeader: {
            flexDirection: "row",
            backgroundColor: "#eee",
            paddingVertical: 10,
        },
        row: {
            flexDirection: "row",
            paddingVertical: 10,
            borderBottomWidth: 1,
            borderColor: "#ddd",
        },
        cell: {
            flex: 1,
            paddingHorizontal: 8,
            fontSize: 12,
        },
        header: {
            fontWeight: "bold",
        },
    modalGeneral: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.4)",
        justifyContent: "center",
        alignItems: "center",
    },
    modalBody: {
        backgroundColor: "white",
        padding: 20,
        borderRadius: 12,
        width: "100%",
        maxWidth: 400,
    },
    modalText: {
        fontSize: 18,
        fontWeight: "600",
        marginBottom: 10
    }

});
export default styles
