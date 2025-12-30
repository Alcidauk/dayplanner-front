import axios from "axios";
import { API_URL } from "@/constants/constants";

export interface Activity {
    id: number;
    title: string;
    description: string;
    location: string;
    duration: string;
}

export interface ActivityListResponse {
    activities: Activity[];
}

export const getActivities = async (token: string) => {
    const response = await axios.get(`${API_URL}/activity/activities`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return response.data;
};
