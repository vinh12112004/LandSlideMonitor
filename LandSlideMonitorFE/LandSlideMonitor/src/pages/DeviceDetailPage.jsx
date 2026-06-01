import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import deviceService from "../services/deviceService";
import {
    createSensor,
    updateSensor,
    deleteSensor,
} from "../services/sensorService";
import channelDefinitionService from "../services/channelDefinitionService";
import sensordataService from "../services/sensordataService";
import DeviceDetailHeader from "../components/devices/DeviceDetailHeader";
import DeviceStats from "../components/devices/DeviceStats";
import SensorList from "../components/devices/SensorList";
import HistoryList from "../components/devices/HistoryList";
import SensorModal from "../components/devices/SensorModal";
import DeleteConfirmModal from "../components/devices/DeleteConfirmModal";
import { DEVICE_STATUS_CONFIG } from "../constants/sensorConfig";
import { onSignalR, offSignalR } from "../services/signalr";
// ── Main Page ─────────────────────────────────────────────────────────────────
export default function DeviceDetailPage() {
    const { deviceId } = useParams();
    const navigate = useNavigate();

    const [device, setDevice] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [sensorTypes, setSensorTypes] = useState([]);

    // History
    const [history, setHistory] = useState([]);
    const [historyLoading, setHistoryLoading] = useState(false);
    const [historyPage, setHistoryPage] = useState(1);
    const [historyTotalPages, setHistoryTotalPages] = useState(1);
    const historyPageSize = 10;
    const [historyTotalCount, setHistoryTotalCount] = useState(0);

    useEffect(() => {
        const fetchTypes = async () => {
            try {
                const data = await channelDefinitionService.getAll();
                setSensorTypes(data);
            } catch (err) {
                console.error("Failed to load sensor types:", err);
            }
        };
        fetchTypes();
    }, []);

    // State – modals
    const [modal, setModal] = useState(null); // null | { type: "add" | "edit" | "delete", sensor }

    // State – active tab
    const [tab, setTab] = useState("sensors"); // "sensors" | "history"

    const fetchDeviceData = useCallback(async () => {
        try {
            setLoading(true);
            const deviceData = await deviceService.getById(deviceId);
            setDevice(deviceData);
        } catch (err) {
            console.error(err);
            setError("Không thể tải dữ liệu");
        } finally {
            setLoading(false);
        }
    }, [deviceId]);

    useEffect(() => {
        if (!deviceId) return;
        fetchDeviceData();
    }, [deviceId, fetchDeviceData]);

    useEffect(() => {
        const fetchHistory = async () => {
            if (!deviceId) return;
            try {
                setHistoryLoading(true);
                const res = await sensordataService.getAll({
                    deviceId,
                    page: historyPage,
                    limit: historyPageSize,
                });
                setHistory(res.data || []);
                setHistoryTotalPages(res.totalPages || 1);
                setHistoryTotalCount(res.totalCount || 0);
            } catch (err) {
                console.error("Failed to load history:", err);
            } finally {
                setHistoryLoading(false);
            }
        };

        fetchHistory();
    }, [deviceId, historyPage]);

    useEffect(() => {
        const handleNewSensorData = (newData) => {
            if (newData.deviceId !== deviceId) return;

            setHistoryTotalCount((prev) => prev + 1);

            if (historyPage !== 1) return;

            setHistory((prev) => {
                const exists = prev.some((x) => x.id === newData.id);

                if (exists) return prev;

                return [newData, ...prev].slice(0, historyPageSize);
            });
        };

        onSignalR("ReceiveSensorData", handleNewSensorData);

        return () => {
            offSignalR("ReceiveSensorData", handleNewSensorData);
        };
    }, [deviceId, historyPage]);

    const sensors = device?.sensors || [];

    // ── Handlers ────────────────────────────────────────────────────────────
    const handleSaveSensor = async (formData, sensorId) => {
        setSubmitting(true);
        try {
            if (sensorId) {
                await updateSensor(sensorId, formData);
            } else {
                await createSensor(formData);
            }
            setModal(null);
            await fetchDeviceData(); // Refresh data
        } catch (err) {
            console.error("Failed to save sensor:", err);
            alert("Đã xảy ra lỗi khi lưu sensor. Vui lòng thử lại.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteSensor = async (sensorId) => {
        setSubmitting(true);
        try {
            await deleteSensor(sensorId);
            setModal(null);
            await fetchDeviceData(); // Refresh data
        } catch (err) {
            console.error("Failed to delete sensor:", err);
            alert("Đã xảy ra lỗi khi xóa sensor. Vui lòng thử lại.");
        } finally {
            setSubmitting(false);
        }
    };

    const formatTime = (iso) => {
        if (!iso) return "N/A";
        const d = new Date(iso);
        return d.toLocaleString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    if (loading && !device) {
        return (
            <main className="ml-64 p-8 bg-surface min-h-screen flex items-center justify-center">
                <p>Đang tải dữ liệu thiết bị...</p>
            </main>
        );
    }

    if (error) {
        return (
            <main className="ml-64 p-8 bg-surface min-h-screen flex items-center justify-center">
                <p className="text-tertiary">{error}</p>
            </main>
        );
    }

    if (!device) {
        return (
            <main className="ml-64 p-8 bg-surface min-h-screen flex items-center justify-center">
                <p>Không tìm thấy thiết bị.</p>
            </main>
        );
    }

    return (
        <main
            className="ml-64 p-8 bg-surface min-h-screen"
            style={{ boxSizing: "border-box" }}
        >
            <DeviceDetailHeader
                device={device}
                formatTime={formatTime}
                onBack={() => navigate("/devices")}
            />

            <DeviceStats sensors={sensors} history={history} />

            <div
                style={{
                    display: "flex",
                    gap: 2,
                    marginBottom: 20,
                    borderBottom: "0.5px solid var(--color-border-tertiary)",
                }}
            >
                {[
                    {
                        key: "sensors",
                        icon: "sensors",
                        label: "Quản lý Sensor",
                    },
                    {
                        key: "history",
                        icon: "history",
                        label: "Lịch sử dữ liệu",
                    },
                ].map((t) => (
                    <button
                        key={t.key}
                        onClick={() => setTab(t.key)}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                            padding: "10px 18px",
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            fontSize: 14,
                            fontWeight: tab === t.key ? 500 : 400,
                            color:
                                tab === t.key
                                    ? "#185FA5"
                                    : "var(--color-text-secondary)",
                            borderBottom:
                                tab === t.key
                                    ? "2px solid #185FA5"
                                    : "2px solid transparent",
                            marginBottom: -1,
                        }}
                    >
                        <span
                            className="material-symbols-outlined"
                            style={{ fontSize: 16 }}
                        >
                            {t.icon}
                        </span>
                        {t.label}
                    </button>
                ))}
            </div>

            {tab === "sensors" && (
                <SensorList
                    sensors={sensors}
                    loading={loading}
                    onAdd={() => setModal({ type: "add" })}
                    onEdit={(sensor) => setModal({ type: "edit", sensor })}
                    onDelete={(sensor) => setModal({ type: "delete", sensor })}
                />
            )}

            {tab === "history" && (
                <HistoryList
                    history={history}
                    formatTime={formatTime}
                    loading={historyLoading}
                    page={historyPage}
                    totalPages={historyTotalPages}
                    onPageChange={setHistoryPage}
                    pageSize={historyPageSize}
                    totalCount={historyTotalCount}
                />
            )}
            {(modal?.type === "add" || modal?.type === "edit") && (
                <SensorModal
                    sensor={modal.sensor}
                    deviceId={deviceId}
                    sensorTypes={sensorTypes}
                    onClose={() => setModal(null)}
                    onSave={handleSaveSensor}
                    submitting={submitting}
                />
            )}
            {modal?.type === "delete" && (
                <DeleteConfirmModal
                    sensor={modal.sensor}
                    onClose={() => setModal(null)}
                    onConfirm={handleDeleteSensor}
                    submitting={submitting}
                />
            )}
        </main>
    );
}
