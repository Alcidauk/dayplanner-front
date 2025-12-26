import axios from "axios";
import { API_URL } from "@/constants/constants";

export interface UserCreate {
    name: string;
    surname: string;
    email: string;
}

export interface UserResponse {
    id: number;
    name: string;
    surname: string;
    email: string;
    google_account_id: string | null;
}

export const createUser = async (userData: UserCreate): Promise<UserResponse> => {
    const response = await axios.put(`${API_URL}/user`, userData, {
        headers: { "Content-Type": "application/json" },
    });

    return response.data;
};
