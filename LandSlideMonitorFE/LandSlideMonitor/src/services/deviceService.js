import api from "../lib/axios";

const deviceService = {
    getAll: async () => {
        const res = await api.get("/devices");
        return res.data;
    },

    create: async (deviceData) => {
        // deviceData: { id, location }
        const res = await api.post("/devices", deviceData);
        return res.data;
    },

    update: async (id, deviceData) => {
        // deviceData: { name, location, status }
        const res = await api.put(`/devices/${id}`, deviceData);
        return res.data;
    },

    delete: async (id) => {
        const res = await api.delete(`/devices/${id}`);
        return res.data;
    },
};

export default deviceService;
