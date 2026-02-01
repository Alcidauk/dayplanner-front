import { apiClient, authHeaders } from "./apiClient";
import { CalendarEvent, Activity } from "./types";
import {requireAuth} from "@/utils/utils";
import {getToken} from "@/hooks/token";

export const getGoogleCalendarEvents = async (date?: Date): Promise<CalendarEvent[]> => {
    const token = await requireAuth();
    const params = date
        ? { date: date.toISOString() }
        : undefined;
    const response = await apiClient.get<{ events: CalendarEvent[] }>(
        "/google_calendar/events",
        {...authHeaders(token),
        params}
    );

    return response.data.events;
};

export const addEventToGoogleCalendar = async (event: CalendarEvent) => {
    const token = await requireAuth();
    const eventBody = {
        summary: event.summary,
        description: event.description,
        location: event.location,
        start: event.start,
        end: event.end,
    };

    await apiClient.post("/google_calendar/add_google_event", eventBody, authHeaders(token));
};
