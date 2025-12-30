import { API_URL } from "@/constants/constants";
import {apiClient, authHeaders} from "@/api/apiClient";
import { UserInfoCreate } from "./types";


export const addUserInfo = async (data: UserInfoCreate, token: string) => {
    const response = await apiClient.put(
        `${API_URL}/user/user_info`,
        data,
        authHeaders(token)
    );
    return response.data;
};
