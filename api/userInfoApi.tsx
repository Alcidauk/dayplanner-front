import axios from "axios";
import { API_URL } from "@/constants/constants";

interface UserInfoCreate {
    place: string;
    interests: string[];
}

export const addUserInfo = async (data: UserInfoCreate, token: string) => {
    const response = await axios.put(`${API_URL}/user/user_info`, data, {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    });
    return response.data;
};
