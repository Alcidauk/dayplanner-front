import { API_URL } from "@/constants/constants";
import {RegisterPayload, UserCreate, UserResponse} from "@/api/types";
import {apiClient, authHeaders} from "@/api/apiClient";
import {getAccessToken} from "@/hooks/token";
import {showAlert} from "@/utils/alertManager";
import {handleErrorMessages, redirectIndex} from "@/utils/utils";


export const getCurrentUser = async () : Promise<UserResponse>  => {
    const token = await getAccessToken();
    const response = await apiClient.get("/user/current_user", authHeaders(token));
    return response.data;
};


export const createUser = async (userData: UserCreate): Promise<UserResponse> => {
    const response = await apiClient.post(
        `${API_URL}/user/register`,
        userData
    );
    return response.data;
};

export const register = async ({name, surname, email, password}: RegisterPayload)  => {
    if (!name || !surname || !email || !password) {
        showAlert("error", "Erreur", "Tous les champs sont obligatoires");
        return;
    }
    try {
        const user = await createUser({ name, surname, email, password });
        console.log("USER RETOUR API:", user);

        setTimeout(() => {
            showAlert("success","Succès", `Compte créé pour ${user.email}`);
        }, 0);
        redirectIndex()

    } catch (error: unknown) {
        let message = handleErrorMessages(error)
        showAlert("error", "Erreur", message);
    }
};
