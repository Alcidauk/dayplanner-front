import * as Calendar from "expo-calendar";
import { Platform } from "react-native";

const requestCalendarPermission = async () => {
    const { status } = await Calendar.requestCalendarPermissionsAsync();
    return status === "granted";
};

export async function addEventToLocalCalendar({
                                                  title,
                                                  description,
                                                  location,
                                                  startDate,
                                                  endDate,
                                              }: {
    title: string;
    description?: string;
    location?: string;
    startDate: Date;
    endDate: Date;
}) {
    const granted = await requestCalendarPermission();
    if (!granted) {
        throw new Error("Permission calendrier refusée");
    }
    const calendars = await Calendar.getCalendarsAsync(
        Calendar.EntityTypes.EVENT
    );

    const writableCalendar = calendars.find(
        (cal) =>
            cal.allowsModifications &&
            (Platform.OS !== "android" || cal.accessLevel === Calendar.CalendarAccessLevel.OWNER)
    );

    if (!writableCalendar) {
        throw new Error("Aucun calendrier modifiable trouvé");
    }

    return await Calendar.createEventAsync(writableCalendar.id, {
        title,
        notes: description,
        location,
        startDate,
        endDate,
        allDay: false,
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    });
}
