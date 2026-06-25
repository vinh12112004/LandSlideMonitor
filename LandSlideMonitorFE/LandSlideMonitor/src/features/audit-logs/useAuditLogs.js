import { useCallback, useEffect, useMemo, useState } from "react";
import auditLogService from "../../services/auditLogService";

export const AUDIT_LOGS_LIMIT = 10;

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
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchAuditLogs = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const result = await auditLogService.getAll({
                page,
                limit: AUDIT_LOGS_LIMIT,
            });

            setData(Array.isArray(result) ? createArrayResult(result) : result);
        } catch (err) {
            setError("Không thể tải nhật ký hệ thống. Vui lòng thử lại.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [page]);

    useEffect(() => {
        fetchAuditLogs();
    }, [fetchAuditLogs]);

    const pagination = useMemo(
        () => ({
            currentPage: data?.currentPage ?? page,
            totalPages: data?.totalPages ?? 1,
            pageSize: data?.pageSize ?? AUDIT_LOGS_LIMIT,
            totalCount: data?.totalCount ?? 0,
        }),
        [data, page],
    );

    return {
        data,
        rows: data?.data || [],
        loading,
        error,
        pagination,
        isPaged: !data?.isArrayResponse,
        setPage,
        refetch: fetchAuditLogs,
    };
}
