import { API_URL } from "@/constants/constants";
import {apiClient, authHeaders} from "@/api/apiClient";
import { UserInfoCreate } from "./types";
import {requireAuth} from "@/utils/utils";


export const addUserInfo = async (data: UserInfoCreate) => {
    const token = await requireAuth();
    const response = await apiClient.put(
        `${API_URL}/user/user_info`,
        data,
        authHeaders(token)
    );
    return response.data;
};
