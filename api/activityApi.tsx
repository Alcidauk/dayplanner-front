import axios from "axios";
import { API_URL } from "@/constants/constants";

export const getActivities = async (token: string) => {
    const response = await axios.get(`${API_URL}/openai/activities`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return response.data;
};
