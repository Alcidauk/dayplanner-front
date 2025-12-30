import axios from "axios";
import { API_URL } from "@/constants/constants";

export interface CalendarEvent {
    id: string;
    title: string;
    start: string;
    end: string;
    location?: string;
}

export const getCalendarEvents = async (token: string) => {
    const response = await axios.get(`${API_URL}/google_calendar/events`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return response.data.events as CalendarEvent[];
};
