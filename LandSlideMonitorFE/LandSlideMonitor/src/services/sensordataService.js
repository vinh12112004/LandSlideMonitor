import api from "../lib/axios";

const sensordataService = {
    getAll: async ({
        dateFrom,
        dateTo,
        deviceId,
        page = 1,
        limit = 10,
    } = {}) => {
        const params = {
            pageNumber: page,
            pageSize: limit,
        };

        if (dateFrom) params.from = dateFrom;
        if (dateTo) params.to = dateTo;
        if (deviceId && deviceId !== "all") params.deviceId = deviceId;

        const res = await api.get("/sensordata", { params });

        return res.data;
    },
    getAlerts: async ({
        dateFrom,
        dateTo,
        deviceId,
        page = 1,
        limit = 10,
    } = {}) => {
        const params = { pageNumber: page, pageSize: limit };
        if (dateFrom) params.from = dateFrom;
        if (dateTo) params.to = dateTo;
        if (deviceId && deviceId !== "all") params.deviceId = deviceId;
        const res = await api.get("/sensordata/alerts", { params });
        return res.data;
    },
    getLatestForAll: async (provinceIdOrParams) => {
        const provinceId =
            typeof provinceIdOrParams === "object"
                ? provinceIdOrParams?.provinceId
                : provinceIdOrParams;
        const res = await api.get("/sensordata/latest-all", {
            params: { provinceId },
        });
        return res.data;
    },
};

export default sensordataService;
