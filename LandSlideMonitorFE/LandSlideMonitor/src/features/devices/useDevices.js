import { useCallback, useEffect, useMemo, useState } from "react";
import deviceService from "../../services/deviceService";
import { getConnection } from "../../services/signalr";
import { getCurrentUser } from "../../services/authService";
import { useDebouncedValue } from "../../hooks/useDebouncedValue";

const DEFAULT_QUERY = {
    searchTerm: "",
    provinceId: "all",
    status: "all",
    currentPage: 1,
    pageSize: 10,
};

export function useDevices(user) {
    const currentUser = user || getCurrentUser();
    const [query, setQuery] = useState(DEFAULT_QUERY);
    const [devices, setDevices] = useState([]);
    const [healthDevices, setHealthDevices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [mutationError, setMutationError] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [deletingId, setDeletingId] = useState(null);
    const [totals, setTotals] = useState({
        totalPages: 1,
        totalCount: 0,
        pageSize: 10,
    });
    const debouncedSearchTerm = useDebouncedValue(query.searchTerm, 300);

    const provinceIdForRequest = useMemo(() => {
        if (query.provinceId === "all") return null;
        if (
            currentUser?.role === "Manager" &&
            !currentUser.provinceIds?.includes(parseInt(query.provinceId, 10))
        ) {
            return null;
        }
        return query.provinceId;
    }, [currentUser, query.provinceId]);

    const fetchDevices = useCallback(
        async (page = query.currentPage) => {
            if (!currentUser) return;

            try {
                setLoading(true);
                setError(null);
                const result = await deviceService.getAll({
                    pageNumber: page,
                    pageSize: query.pageSize,
                    searchTerm: debouncedSearchTerm,
                    provinceId: provinceIdForRequest,
                    status: query.status === "all" ? null : query.status,
                });
                setDevices(result.data || []);
                setTotals({
                    totalPages: result.totalPages || 1,
                    totalCount: result.totalCount || 0,
                    pageSize: result.pageSize || query.pageSize,
                });
                setQuery((prev) => ({
                    ...prev,
                    currentPage: result.currentPage || page,
                }));
            } catch (err) {
                setError("Không thể tải danh sách thiết bị. Vui lòng thử lại.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        },
        [
            currentUser,
            debouncedSearchTerm,
            provinceIdForRequest,
            query.currentPage,
            query.pageSize,
            query.status,
        ],
    );

    const fetchHealthDevices = useCallback(async () => {
        if (!currentUser) return;

        try {
            const result = await deviceService.getAll({
                pageNumber: 1,
                pageSize: 9999,
            });
            setHealthDevices(result.data || []);
        } catch (err) {
            console.error("Failed to fetch device health summary:", err);
        }
    }, [currentUser]);

    useEffect(() => {
        fetchDevices(query.currentPage);
    }, [fetchDevices, query.currentPage]);

    useEffect(() => {
        fetchHealthDevices();
    }, [fetchHealthDevices]);

    useEffect(() => {
        const connection = getConnection();
        if (!connection) return undefined;

        const handler = (data) => {
            setDevices((prev) =>
                prev.map((device) =>
                    device.deviceId === data.deviceId
                        ? {
                              ...device,
                              status: data.status,
                              lastSeen: data.lastSeen,
                              lastLatitude:
                                  data.lastLatitude ?? device.lastLatitude,
                              lastLongitude:
                                  data.lastLongitude ?? device.lastLongitude,
                          }
                        : device,
                ),
            );
            fetchHealthDevices();
        };

        connection.on("DeviceStatusChanged", handler);

        return () => {
            connection.off("DeviceStatusChanged", handler);
        };
    }, [fetchHealthDevices]);

    const setSearchQuery = useCallback((value) => {
        setQuery((prev) => ({ ...prev, searchTerm: value, currentPage: 1 }));
    }, []);

    const setFilter = useCallback((key, value) => {
        setQuery((prev) => ({ ...prev, [key]: value, currentPage: 1 }));
    }, []);

    const setPage = useCallback((page) => {
        setQuery((prev) => ({ ...prev, currentPage: page }));
    }, []);

    const saveDevice = useCallback(
        async (deviceData, editingDevice) => {
            try {
                setSubmitting(true);
                setMutationError(null);
                if (editingDevice) {
                    await deviceService.update(editingDevice.deviceId, deviceData);
                } else {
                    await deviceService.create(deviceData);
                }
                await fetchDevices(query.currentPage);
                await fetchHealthDevices();
                return true;
            } catch (err) {
                setMutationError("Lưu thất bại. Vui lòng thử lại.");
                console.error(err);
                return false;
            } finally {
                setSubmitting(false);
            }
        },
        [fetchDevices, fetchHealthDevices, query.currentPage],
    );

    const deleteDevice = useCallback(
        async (deviceId) => {
            try {
                setDeletingId(deviceId);
                setMutationError(null);
                await deviceService.delete(deviceId);
                await fetchDevices(query.currentPage);
                await fetchHealthDevices();
                return true;
            } catch (err) {
                setMutationError("Xóa thất bại. Vui lòng thử lại.");
                console.error(err);
                return false;
            } finally {
                setDeletingId(null);
            }
        },
        [fetchDevices, fetchHealthDevices, query.currentPage],
    );

    return {
        devices,
        healthDevices,
        loading,
        error,
        mutationError,
        setMutationError,
        submitting,
        deletingId,
        query,
        pagination: {
            currentPage: query.currentPage,
            totalPages: totals.totalPages,
            totalCount: totals.totalCount,
            pageSize: totals.pageSize,
        },
        setSearchQuery,
        setFilter,
        setPage,
        saveDevice,
        deleteDevice,
        refetch: () => fetchDevices(1),
    };
}
