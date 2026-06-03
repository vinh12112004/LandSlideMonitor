import { useCallback, useEffect, useState } from "react";
import channelDefinitionService from "../../services/channelDefinitionService";
import deviceService from "../../services/deviceService";
import sensordataService from "../../services/sensordataService";
import {
    createSensor,
    deleteSensor,
    updateSensor,
} from "../../services/sensorService";
import { offSignalR, onSignalR } from "../../services/signalr";

const HISTORY_PAGE_SIZE = 10;

export function useDeviceDetail(deviceId) {
    const [device, setDevice] = useState(null);
    const [sensorTypes, setSensorTypes] = useState([]);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [historyLoading, setHistoryLoading] = useState(false);
    const [error, setError] = useState(null);
    const [mutationError, setMutationError] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [historyPage, setHistoryPage] = useState(1);
    const [historyTotalPages, setHistoryTotalPages] = useState(1);
    const [historyTotalCount, setHistoryTotalCount] = useState(0);

    const fetchDeviceData = useCallback(async () => {
        if (!deviceId) return;
        try {
            setLoading(true);
            setError(null);
            const deviceData = await deviceService.getById(deviceId);
            setDevice(deviceData);
        } catch (err) {
            setError("Không thể tải dữ liệu thiết bị.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [deviceId]);

    const fetchSensorTypes = useCallback(async () => {
        try {
            const data = await channelDefinitionService.getAll();
            setSensorTypes(data || []);
        } catch (err) {
            setMutationError("Không thể tải danh sách kênh sensor.");
            console.error(err);
        }
    }, []);

    const fetchHistory = useCallback(async () => {
        if (!deviceId) return;
        try {
            setHistoryLoading(true);
            const res = await sensordataService.getAll({
                deviceId,
                page: historyPage,
                limit: HISTORY_PAGE_SIZE,
            });
            setHistory(res.data || []);
            setHistoryTotalPages(res.totalPages || 1);
            setHistoryTotalCount(res.totalCount || 0);
        } catch (err) {
            setMutationError("Không thể tải lịch sử dữ liệu.");
            console.error(err);
        } finally {
            setHistoryLoading(false);
        }
    }, [deviceId, historyPage]);

    useEffect(() => {
        fetchSensorTypes();
    }, [fetchSensorTypes]);

    useEffect(() => {
        fetchDeviceData();
    }, [fetchDeviceData]);

    useEffect(() => {
        fetchHistory();
    }, [fetchHistory]);

    useEffect(() => {
        const handleNewSensorData = (newData) => {
            if (newData.deviceId !== deviceId) return;

            setHistoryTotalCount((prev) => prev + 1);
            if (historyPage !== 1) return;

            setHistory((prev) => {
                const exists = prev.some((item) => item.id === newData.id);
                if (exists) return prev;
                return [newData, ...prev].slice(0, HISTORY_PAGE_SIZE);
            });
        };

        onSignalR("ReceiveSensorData", handleNewSensorData);
        return () => offSignalR("ReceiveSensorData", handleNewSensorData);
    }, [deviceId, historyPage]);

    const saveSensor = useCallback(
        async (formData, sensorId) => {
            try {
                setSubmitting(true);
                setMutationError(null);
                if (sensorId) {
                    await updateSensor(sensorId, formData);
                } else {
                    await createSensor(formData);
                }
                await fetchDeviceData();
                return true;
            } catch (err) {
                setMutationError(
                    "Đã xảy ra lỗi khi lưu sensor. Vui lòng thử lại.",
                );
                console.error(err);
                return false;
            } finally {
                setSubmitting(false);
            }
        },
        [fetchDeviceData],
    );

    const removeSensor = useCallback(
        async (sensorId) => {
            try {
                setSubmitting(true);
                setMutationError(null);
                await deleteSensor(sensorId);
                await fetchDeviceData();
                return true;
            } catch (err) {
                setMutationError(
                    "Đã xảy ra lỗi khi xóa sensor. Vui lòng thử lại.",
                );
                console.error(err);
                return false;
            } finally {
                setSubmitting(false);
            }
        },
        [fetchDeviceData],
    );

    const formatTime = useCallback((iso) => {
        if (!iso) return "N/A";
        const date = new Date(iso);
        return date.toLocaleString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    }, []);

    return {
        device,
        sensors: device?.sensors || [],
        sensorTypes,
        history,
        loading,
        historyLoading,
        error,
        mutationError,
        setMutationError,
        submitting,
        historyPage,
        setHistoryPage,
        historyTotalPages,
        historyTotalCount,
        historyPageSize: HISTORY_PAGE_SIZE,
        saveSensor,
        removeSensor,
        formatTime,
        refetch: fetchDeviceData,
    };
}
