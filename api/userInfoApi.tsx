import {apiClient, authHeaders} from "@/api/apiClient";
import { UserInfoCreate, UserInfoResponse} from "./types";
import {requireAuth} from "@/utils/utils";


export const addUserInfo = async (data: UserInfoCreate) => {
    const token = await requireAuth();
    const response = await apiClient.post(
        '/user_info',
        data,
        authHeaders(token)
    );
    return response.data;
};

export const getUserInfo = async (): Promise<UserInfoResponse> => {
    const token = await requireAuth();
    const response = await apiClient.get(
        '/user_info',
        authHeaders(token));
    return response.data;
};

export const addInterest = async (interest: string): Promise<UserInfoResponse> => {
    const token = await requireAuth();
    const response = await apiClient.post(
        '/user_info/add_interest',
        { interest },
        authHeaders(token));
    return response.data;
};

export const removeInterest = async (interest: string): Promise<UserInfoResponse> => {
    const token = await requireAuth();
    const response = await apiClient.delete(
        '/user_info/remove_interest',
        {
            data: { interest },
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
    return response.data;
};

export const updatePlace = async (place: string): Promise<UserInfoResponse> => {
    const token = await requireAuth();
    const response = await apiClient.put(
        '/user_info/update_place',
        {
            place: place,
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
    return response.data;
};
