import api from "../lib/axios";

const auditLogService = {
    getAll: async ({ page = 1, limit = 10 } = {}) => {
        const res = await api.get("/auditlogs", {
            params: {
                pageNumber: page,
                pageSize: limit,
            },
        });

        return res.data;
    },
};

export default auditLogService;
