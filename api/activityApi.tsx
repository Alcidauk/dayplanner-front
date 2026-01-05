import { apiClient, authHeaders } from "./apiClient";
import { ActivityListResponse } from "./types";
import {requireAuth} from "@/utils/utils";

export const getActivities = async () => {
    const token = await requireAuth();
    const response = await apiClient.get<ActivityListResponse>(
        "/activity/activities",
        authHeaders(token)
    );

    return response.data.activities;
};
