import { useCallback, useEffect, useState } from "react";
import { getProvinces } from "../services/provinceService";

export function useProvinces() {
    const [provinces, setProvinces] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchProvinces = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await getProvinces();
            setProvinces(data);
        } catch (err) {
            setError("Không thể tải danh sách tỉnh/thành phố.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProvinces();
    }, [fetchProvinces]);

    return { provinces, loading, error, refetch: fetchProvinces };
}
