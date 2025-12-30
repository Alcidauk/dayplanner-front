import { StyleSheet } from 'react-native';

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
    },
    button: {
        fontSize: 20,
        textDecorationLine: 'underline',
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 12,
        marginBottom: 12,
        borderRadius: 6,
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
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 4,
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
        }

});
export default styles
