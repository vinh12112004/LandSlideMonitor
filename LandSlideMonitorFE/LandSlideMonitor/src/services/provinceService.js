import api from "../lib/axios";

export const getProvinces = async () => {
    try {
        const response = await api.get("/provinces");
        return response.data;
    } catch (error) {
        console.error("Error fetching provinces:", error);
        throw error;
    }
};
