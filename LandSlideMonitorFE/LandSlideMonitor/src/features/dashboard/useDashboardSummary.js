import { useCallback, useEffect, useState } from "react";
import { getDashboardSummary } from "../../services/dashboardService";

export function useDashboardSummary() {
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchSummary = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const result = await getDashboardSummary();
            setSummary(result ?? null);
        } catch (err) {
            setError("Không thể tải dữ liệu tổng quan. Vui lòng thử lại.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchSummary();
    }, [fetchSummary]);

    return { summary, loading, error, refetch: fetchSummary };
}
