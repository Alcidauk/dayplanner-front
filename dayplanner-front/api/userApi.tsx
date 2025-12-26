import axios from "axios";
import { API_URL } from "@/constants/constants"

export const createUser = async (userData :any) => {
    const response = await axios.put(
        `${API_URL}/user`, userData,
        {
            headers: {
                "Content-Type": "application/json",
            },
        }
    );
    return response.data;
};
