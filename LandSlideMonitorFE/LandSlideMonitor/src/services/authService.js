import api from "../lib/axios";

export const login = async (username, password) => {
    const response = await api.post("/auth/login", { username, password });
    if (response.data) {
        localStorage.setItem("accessToken", response.data.accessToken);
        localStorage.setItem("refreshToken", response.data.refreshToken);
        localStorage.setItem("user", JSON.stringify(response.data.user));
    }
    return response.data;
};

export const logout = () => {
    const refreshToken = localStorage.getItem("refreshToken");
    if (refreshToken) {
        void api
            .post("/auth/logout", { refreshToken })
            .catch((error) => console.error("Logout failed", error));
    }
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
};

export const getAccessToken = () => localStorage.getItem("accessToken");

export const getCurrentUser = () => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
        try {
            return JSON.parse(userStr);
        } catch {
            localStorage.removeItem("user");
        }
    }
    return null;
};
