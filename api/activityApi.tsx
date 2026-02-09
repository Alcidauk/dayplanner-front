import { apiClient, authHeaders } from "./apiClient";
import {Activity, ActivityListResponse} from "./types";
import {requireAuth} from "@/utils/utils";

export const getActivities = async () => {
    const token = await requireAuth();
    const response = await apiClient.get<ActivityListResponse>(
        "/activity/activities",
        authHeaders(token)
    );

    return response.data.activities;
};

export const addActivities = async (activity: Activity): Promise<Activity> => {
    const token = await requireAuth()
    const response = await apiClient.post<Activity>(
        "/activity/add_activity",
        activity,
        authHeaders(token)
    );
    return response.data;
}
