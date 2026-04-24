import api from "../lib/axios";

const thresholdService = {
    getAll: async () => {
        const res = await api.get("/threshold");
        return res.data;
    },
    create: async (data) => {
        const res = await api.post("/threshold", data);
        return res.data;
    },
    update: async (id, data) => {
        const res = await api.put(`/threshold/${id}`, data);
        return res.data;
    },
    delete: async (id) => {
        const res = await api.delete(`/threshold/${id}`);
        return res.data;
    },
};

export default thresholdService;
