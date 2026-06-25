import { useCallback, useEffect, useMemo, useState } from "react";
import auditLogService from "../../services/auditLogService";

export const AUDIT_LOGS_LIMIT = 10;

const DEFAULT_FILTERS = {
    actionType: "",
    dateFrom: "",
    dateTo: "",
    id: "",
    page: 1,
    userId: "",
};

const createArrayResult = (rows) => ({
    data: rows,
    currentPage: 1,
    totalPages: 1,
    pageSize: rows.length,
    totalCount: rows.length,
    isArrayResponse: true,
});

export function useAuditLogs() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState(DEFAULT_FILTERS);
    const [appliedFilters, setAppliedFilters] = useState(DEFAULT_FILTERS);

    const fetchAuditLogs = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const result = await auditLogService.getAll({
                actionType: appliedFilters.actionType,
                dateFrom: appliedFilters.dateFrom,
                dateTo: appliedFilters.dateTo,
                id: appliedFilters.id,
                page: appliedFilters.page,
                limit: AUDIT_LOGS_LIMIT,
                userId: appliedFilters.userId,
            });

            setData(Array.isArray(result) ? createArrayResult(result) : result);
        } catch (err) {
            setError("Không thể tải nhật ký hệ thống. Vui lòng thử lại.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [appliedFilters]);

    useEffect(() => {
        fetchAuditLogs();
    }, [fetchAuditLogs]);

    const pagination = useMemo(
        () => ({
            currentPage: data?.currentPage ?? appliedFilters.page,
            totalPages: data?.totalPages ?? 1,
            pageSize: data?.pageSize ?? AUDIT_LOGS_LIMIT,
            totalCount: data?.totalCount ?? 0,
        }),
        [appliedFilters.page, data],
    );

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

    return {
        data,
        rows: data?.data || [],
        filters,
        appliedFilters,
        loading,
        error,
        pagination,
        isPaged: !data?.isArrayResponse,
        setFilter,
        search,
        reset,
        setPage,
        refetch: fetchAuditLogs,
    };
}
