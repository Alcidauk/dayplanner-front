import { apiClient, authHeaders } from "./apiClient";
import { CalendarEvent } from "./types";

export const getCalendarEvents = async (token: string) => {
    const response = await apiClient.get<{ events: CalendarEvent[] }>(
        "/google_calendar/events",
        authHeaders(token)
    );

    return response.data.events;
};
