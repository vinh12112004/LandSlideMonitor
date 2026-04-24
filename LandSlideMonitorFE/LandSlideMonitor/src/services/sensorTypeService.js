import api from "../lib/axios";

const sensorTypeService = {
    getAll: async () => {
        const res = await api.get("/sensor-types");
        return res.data;
    },
    create: async (data) => {
        const res = await api.post("/sensor-types", data);
        return res.data;
    },
    update: async (id, data) => {
        const res = await api.put(`/sensor-types/${id}`, data);
        return res.data;
    },
    delete: async (id) => {
        const res = await api.delete(`/sensor-types/${id}`);
        return res.data;
    },
};

export default sensorTypeService;
