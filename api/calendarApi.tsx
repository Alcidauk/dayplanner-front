import { apiClient, authHeaders } from "./apiClient";
import { CalendarEvent, Activity } from "./types";
import {requireAuth} from "@/utils/utils";

export const getCalendarEvents = async (): Promise<CalendarEvent[]> => {
    const token = await requireAuth();
    const response = await apiClient.get<{ events: CalendarEvent[] }>(
        "/google_calendar/events",
        authHeaders(token)
    );

    return response.data.events;
};

export const addEventToCalendar = async (event: CalendarEvent) => {
    const token = await requireAuth();
    const eventBody = {
        summary: event.summary,
        description: event.description,
        location: event.location,
        start: new Date().toISOString(),
        end: new Date(new Date().getTime() + 60*60*1000).toISOString(), // +1h
    };

    await apiClient.post("/google_calendar/add_event", eventBody, authHeaders(token));
};
