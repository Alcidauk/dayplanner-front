import { API_URL } from "@/constants/constants";
import {apiClient, authHeaders} from "@/api/apiClient";
import { UserInfoCreate, UserInfoResponse} from "./types";
import {requireAuth} from "@/utils/utils";


export const addUserInfo = async (data: UserInfoCreate) => {
    const token = await requireAuth();
    const response = await apiClient.post(
        `${API_URL}/user/user_info`,
        data,
        authHeaders(token)
    );
    return response.data;
};

export const getUserInfo = async (): Promise<UserInfoResponse> => {
    const token = await requireAuth();
    const response = await apiClient.get(
        `${API_URL}/user/user_info`,
        authHeaders(token)
    );
    return response.data;
};
