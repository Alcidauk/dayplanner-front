import { API_URL } from "@/constants/constants";
import {RegisterPayload, UserCreate, UserResponse} from "@/api/types";
import {apiClient} from "@/api/apiClient";
import {showAlert} from "@/utils/utils";
import axios from "axios";



export const createUser = async (userData: UserCreate): Promise<UserResponse> => {
    const response = await apiClient.put(
        `${API_URL}/user`,
        userData
    );
    return response.data;
};

export const register = async ({name, surname, email, password}: RegisterPayload) => {
    if (!name || !surname || !email || !password) {
        showAlert("Erreur", "Tous les champs sont obligatoires");
        return;
    }
    try {
        const user = await createUser({ name, surname, email, password });
        console.log("USER RETOUR API:", user);

        setTimeout(() => {
            showAlert("Succès", `Compte créé pour ${user.email}`);
        }, 0);

    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            showAlert("Erreur", error.response?.data?.detail ?? "Erreur serveur");
        } else {
            showAlert("Erreur", "Erreur inconnue");
        }
    }
};
