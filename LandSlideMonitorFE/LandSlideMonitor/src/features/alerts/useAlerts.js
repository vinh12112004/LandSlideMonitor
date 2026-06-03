import { useCallback, useEffect, useMemo, useState } from "react";
import sensordataService from "../../services/sensordataService";

export const ALERTS_LIMIT = 10;

const DEFAULT_FILTERS = {
    deviceId: "",
    dateFrom: "",
    dateTo: "",
    page: 1,
};

export function useAlerts() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState(DEFAULT_FILTERS);
    const [appliedFilters, setAppliedFilters] = useState(DEFAULT_FILTERS);

    const fetchAlerts = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const result = await sensordataService.getAlerts({
                deviceId: appliedFilters.deviceId,
                dateFrom: appliedFilters.dateFrom,
                dateTo: appliedFilters.dateTo,
                page: appliedFilters.page,
                limit: ALERTS_LIMIT,
            });
            setData(result);
        } catch (err) {
            setError("Không thể tải dữ liệu cảnh báo. Vui lòng thử lại.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [appliedFilters]);

    useEffect(() => {
        fetchAlerts();
    }, [fetchAlerts]);

    const setFilter = useCallback((name, value) => {
        setFilters((prev) => ({ ...prev, [name]: value }));
    }, []);

    const search = useCallback(() => {
        setAppliedFilters({ ...filters, page: 1 });
    }, [filters]);

    const reset = useCallback(() => {
        setFilters(DEFAULT_FILTERS);
        setAppliedFilters(DEFAULT_FILTERS);
    }, []);

    const setPage = useCallback((page) => {
        setAppliedFilters((prev) => ({ ...prev, page }));
    }, []);

    const stats = useMemo(() => {
        const rows = data?.data || [];
        return {
            total: data?.totalCount,
            warning: rows.filter((row) => row.status === 1).length,
            alert: rows.filter((row) => row.status === 2).length,
        };
    }, [data]);

    return {
        data,
        rows: data?.data || [],
        filters,
        appliedFilters,
        loading,
        error,
        stats,
        setFilter,
        search,
        reset,
        setPage,
        refetch: fetchAlerts,
    };
}
