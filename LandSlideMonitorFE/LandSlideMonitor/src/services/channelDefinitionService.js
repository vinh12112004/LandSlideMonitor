import api from "../lib/axios";

const channelDefinitionService = {
    getAll: async () => (await api.get("/channel-definitition")).data,
    create: async (data) =>
        (await api.post("/channel-definitition", data)).data,
    update: async (id, data) =>
        (await api.put(`/channel-definitition/${id}`, data)).data,
    delete: async (id) =>
        (await api.delete(`/channel-definitition/${id}`)).data,
};

export default channelDefinitionService;
