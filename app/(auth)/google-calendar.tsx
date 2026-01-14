import { useEffect, useState } from "react";
import { View, Text, FlatList, ActivityIndicator } from "react-native";
import { getCalendarEvents } from "@/api/calendarApi";
import styles from "@/styles/styles";
import {CalendarEvent} from "@/api/types";

export default function CalendarScreen() {
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [loading, setLoading] = useState(true);

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleString("fr-FR", {
            day: "2-digit",
            month: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const TableHeader = () => (
        <View style={styles.rowHeader}>
            <Text style={[styles.cell, styles.header]}>Titre</Text>
            <Text style={[styles.cell, styles.header]}>Début</Text>
            <Text style={[styles.cell, styles.header]}>Fin</Text>
            <Text style={[styles.cell, styles.header]}>Lieu</Text>
        </View>
    );
    const TableRow = ({ item }: { item: any }) => (
        <View style={styles.row}>
            <Text style={styles.cell}>{item.title}</Text>
            <Text style={styles.cell}>{formatDate(item.start)}</Text>
            <Text style={styles.cell}>{formatDate(item.end)}</Text>
            <Text style={styles.cell}>{item.location ?? "-"}</Text>
        </View>
    );

    useEffect(() => {
        const fetchEvents = async () => {
            const response = await getCalendarEvents();
            setEvents(response);
            setLoading(false);
        };
        fetchEvents();
    }, []);

    if (loading) return <ActivityIndicator size="large" />;

    return (
    <FlatList
        data={events}
        keyExtractor={(_, i) => i.toString()}
        ListHeaderComponent={TableHeader}
        renderItem={({ item }) => <TableRow item={item} />}
    />
)}
