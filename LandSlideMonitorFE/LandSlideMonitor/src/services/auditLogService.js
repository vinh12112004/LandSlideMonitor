import api from "../lib/axios";

const auditLogService = {
    getAll: async ({
        actionType,
        dateFrom,
        dateTo,
        id,
        page = 1,
        limit = 10,
        userId,
    } = {}) => {
        const params = {
            pageNumber: page,
            pageSize: limit,
        };

        if (dateFrom) params.from = dateFrom;
        if (dateTo) params.to = dateTo;
        if (userId) params.userId = userId;
        if (actionType) params.actionType = actionType;
        if (id) params.id = id;

        const res = await api.get("/auditlogs", {
            params,
        });

        return res.data;
    },
};

export default auditLogService;
