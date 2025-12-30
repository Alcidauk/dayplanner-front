import { API_URL } from "@/constants/constants";
import {UserCreate, UserResponse} from "@/api/types";
import {apiClient} from "@/api/apiClient";



export const createUser = async (userData: UserCreate, token: string): Promise<UserResponse> => {
    const response = await apiClient.put(
        `${API_URL}/user`,
        userData
    );
    return response.data;
};
