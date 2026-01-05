import { apiClient, authHeaders } from "./apiClient";
import { CalendarEvent } from "./types";
import {requireAuth} from "@/utils/utils";

export const getCalendarEvents = async (): Promise<CalendarEvent[]> => {
    const token = await requireAuth();
    const response = await apiClient.get<{ events: CalendarEvent[] }>(
        "/google_calendar/events",
        authHeaders(token)
    );

    return response.data.events;
};

