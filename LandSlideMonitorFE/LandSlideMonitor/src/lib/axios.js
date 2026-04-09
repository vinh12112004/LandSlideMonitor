import axios from "axios";

// Tạo axios instance dùng chung toàn app
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    },
});

// api.interceptors.request.use((config) => {
//     const token = localStorage.getItem("token");
//     if (token) {
//         config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
// });

api.interceptors.response.use(
    (response) => response,
    (error) => {
        const message = error.response?.data?.message || "Đã có lỗi xảy ra";
        console.error("[API Error]", message);
        return Promise.reject(error);
    },
);

export default api;
