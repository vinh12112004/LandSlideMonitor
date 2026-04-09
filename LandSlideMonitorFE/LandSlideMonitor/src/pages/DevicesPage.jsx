import { useState, useEffect } from "react";
import NetworkHealthCard from "../components/devices/NetworkHealthCard";
import DeviceTable from "../components/devices/DeviceTable";
import MaintenanceInsights from "../components/devices/MaintenanceInsights";
import deviceService from "../services/deviceService";

export default function DevicesPage({ searchQuery }) {
    const [devices, setDevices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newDevice, setNewDevice] = useState({ deviceId: "", location: "" });
    const [submitting, setSubmitting] = useState(false);
    const [deletingId, setDeletingId] = useState(null);

    // ── Fetch danh sách thiết bị khi mount ──────────────────────────
    useEffect(() => {
        fetchDevices();
    }, []);

    const fetchDevices = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await deviceService.getAll();
            setDevices(data);
        } catch (err) {
            setError("Không thể tải danh sách thiết bị. Vui lòng thử lại.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // ── Xóa thiết bị ────────────────────────────────────────────────
    const handleDelete = async (id) => {
        if (!confirm(`Xóa thiết bị ${id}?`)) return;
        try {
            setDeletingId(id);
            await deviceService.delete(id);
            setDevices((prev) => prev.filter((d) => d.deviceId !== id));
        } catch (err) {
            alert("Xóa thất bại. Vui lòng thử lại.");
            console.error(err);
        } finally {
            setDeletingId(null);
        }
    };

    // ── Thêm thiết bị mới ───────────────────────────────────────────
    const handleAddDevice = async () => {
        if (!newDevice.deviceId.trim() || !newDevice.location.trim()) return;
        try {
            setSubmitting(true);
            const created = await deviceService.create({
                deviceId: newDevice.deviceId.trim(),
                location: newDevice.location.trim(),
            });
            setDevices((prev) => [...prev, created]);
            setNewDevice({ deviceId: "", location: "" });
            setShowAddModal(false);
        } catch (err) {
            alert("Thêm thiết bị thất bại. Vui lòng thử lại.");
            console.error(err);
        } finally {
            setSubmitting(false);
        }
    };

    // ── Lọc theo search ─────────────────────────────────────────────
    const filtered = devices.filter(
        (d) =>
            d.deviceId.toLowerCase().includes(searchQuery.toLowerCase()) ||
            d.location.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    // ── Loading state ────────────────────────────────────────────────
    if (loading) {
        return (
            <main className="ml-64 p-10 bg-surface min-h-[calc(100vh-64px)] flex items-center justify-center">
                <div className="text-center">
                    <span className="material-symbols-outlined text-5xl text-primary animate-spin block mb-4">
                        progress_activity
                    </span>
                    <p className="text-on-surface-variant text-sm">
                        Đang tải thiết bị...
                    </p>
                </div>
            </main>
        );
    }

    // ── Error state ──────────────────────────────────────────────────
    if (error) {
        return (
            <main className="ml-64 p-10 bg-surface min-h-[calc(100vh-64px)] flex items-center justify-center">
                <div className="text-center">
                    <span className="material-symbols-outlined text-5xl text-tertiary block mb-4">
                        error_outline
                    </span>
                    <p className="text-on-surface font-bold mb-2">
                        Có lỗi xảy ra
                    </p>
                    <p className="text-on-surface-variant text-sm mb-6">
                        {error}
                    </p>
                    <button
                        onClick={fetchDevices}
                        className="px-6 py-2.5 bg-primary text-white rounded-full text-sm font-bold hover:bg-primary/90 transition-colors"
                    >
                        Thử lại
                    </button>
                </div>
            </main>
        );
    }

    return (
        <main className="ml-64 p-10 bg-surface min-h-[calc(100vh-64px)]">
            {/* Page Header */}
            <div className="flex justify-between items-end mb-12">
                <div>
                    <h2 className="text-4xl font-extrabold tracking-tight text-on-surface mb-2">
                        Device Management
                    </h2>
                    <p className="text-on-surface-variant font-body">
                        Manage and monitor the health of your ESP32 seismic
                        sensor network.
                    </p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center gap-2 px-6 py-3.5 bg-gradient-to-br from-primary to-primary-container text-white rounded-full font-bold shadow-lg shadow-primary/20 hover:shadow-xl hover:-translate-y-0.5 transition-all"
                >
                    <span className="material-symbols-outlined">add</span>
                    <span>Add New Device</span>
                </button>
            </div>

            {/* Bento Grid */}
            <div className="grid grid-cols-12 gap-6">
                <NetworkHealthCard devices={devices} />
                <DeviceTable
                    devices={filtered}
                    onDelete={handleDelete}
                    deletingId={deletingId}
                />
                {/* <MaintenanceInsights /> */}
            </div>

            {/* Add Device Modal */}
            {showAddModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl">
                        <h3 className="text-xl font-extrabold text-on-surface mb-6">
                            Add New Device
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block mb-1">
                                    Device ID
                                </label>
                                <input
                                    type="text"
                                    placeholder="ESP32-S3-V1-001"
                                    value={newDevice.deviceId}
                                    onChange={(e) =>
                                        setNewDevice((p) => ({
                                            ...p,
                                            deviceId: e.target.value,
                                        }))
                                    }
                                    className="w-full border border-outline-variant/40 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block mb-1">
                                    Location
                                </label>
                                <input
                                    type="text"
                                    placeholder="North Ridge / Section C"
                                    value={newDevice.location}
                                    onChange={(e) =>
                                        setNewDevice((p) => ({
                                            ...p,
                                            location: e.target.value,
                                        }))
                                    }
                                    className="w-full border border-outline-variant/40 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                                />
                            </div>
                        </div>
                        <div className="flex gap-3 mt-8">
                            <button
                                onClick={() => {
                                    setShowAddModal(false);
                                    setNewDevice({ id: "", location: "" });
                                }}
                                disabled={submitting}
                                className="flex-1 py-3 border border-outline-variant/30 rounded-xl text-sm font-bold text-on-surface-variant hover:bg-surface-container-low transition-colors disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAddDevice}
                                disabled={
                                    submitting ||
                                    !newDevice.deviceId.trim() ||
                                    !newDevice.location.trim()
                                }
                                className="flex-1 py-3 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {submitting ? (
                                    <>
                                        <span className="material-symbols-outlined text-sm animate-spin">
                                            progress_activity
                                        </span>
                                        Đang lưu...
                                    </>
                                ) : (
                                    "Add Device"
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}
