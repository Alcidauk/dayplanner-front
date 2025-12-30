import { apiClient, authHeaders } from "./apiClient";
import { ActivityListResponse } from "./types";

export const getActivities = async (token: string) => {
    const response = await apiClient.get<ActivityListResponse>(
        "/activity/activities",
        authHeaders(token)
    );

    return response.data.activities;
};
