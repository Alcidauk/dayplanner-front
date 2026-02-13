import { apiClient, authHeaders } from "./apiClient";
import {Activity, ActivityListResponse} from "./types";
import {requireAuth} from "@/utils/utils";

export const getActivitiesRecommendations = async (source: 'openai' | 'ollama') => {
    const token = await requireAuth();
    const response = await apiClient.get<ActivityListResponse>(
        `/activity/activities/${source}`,
        authHeaders(token),
    );

    return response.data.activities;
};

export const getActivitiesFromDB = async (): Promise<Activity[]> => {
    const token = await requireAuth();
    const response = await apiClient.get(
        "/activity/activities_manual",
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
