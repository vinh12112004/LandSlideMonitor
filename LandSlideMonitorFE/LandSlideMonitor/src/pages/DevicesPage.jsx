import { useState, useEffect } from "react";
import NetworkHealthCard from "../components/devices/NetworkHealthCard";
import DeviceTable from "../components/devices/DeviceTable";
import MaintenanceInsights from "../components/devices/MaintenanceInsights";
import deviceService from "../services/deviceService";
import { getConnection } from "../services/signalr";
import AddEditDeviceModal from "../components/devices/AddEditDeviceModal";

export default function DevicesPage({ searchQuery }) {
    const [devices, setDevices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingDevice, setEditingDevice] = useState(null); // null for Add, object for Edit
    const [submitting, setSubmitting] = useState(false);
    const [deletingId, setDeletingId] = useState(null);

    // ── Fetch danh sách thiết bị khi mount ──────────────────────────
    useEffect(() => {
        fetchDevices();

        const connection = getConnection();
        if (!connection) return;

        const handler = (data) => {
            console.log("SignalR: DeviceStatusChanged", data);

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
        };

        connection.on("DeviceStatusChanged", handler);

        return () => {
            connection.off("DeviceStatusChanged", handler);
        };
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

    // ── Mở modal ───────────────────────────────────────────────────
    const handleOpenAddModal = () => {
        setEditingDevice(null);
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (device) => {
        setEditingDevice(device);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingDevice(null);
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

    // ── Thêm/Sửa thiết bị ───────────────────────────────────────────
    const handleSaveDevice = async (deviceData) => {
        try {
            setSubmitting(true);
            if (editingDevice) {
                // Update
                const updated = await deviceService.update(
                    editingDevice.deviceId,
                    deviceData,
                );
                setDevices((prev) =>
                    prev.map((d) =>
                        d.deviceId === editingDevice.deviceId ? updated : d,
                    ),
                );
            } else {
                // Create
                const created = await deviceService.create(deviceData);
                setDevices((prev) => [...prev, created]);
            }
            handleCloseModal();
        } catch (err) {
            alert("Lưu thất bại. Vui lòng thử lại.");
            console.error(err);
        } finally {
            setSubmitting(false);
        }
    };

    // ── Lọc theo search ─────────────────────────────────────────────
    const filtered = devices.filter(
        (d) =>
            d.deviceId.toLowerCase().includes(searchQuery.toLowerCase()) ||
            d.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
            d.name.toLowerCase().includes(searchQuery.toLowerCase()),
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
                        Manage and monitor the health of your seismic sensor
                        network.
                    </p>
                </div>
                <button
                    onClick={handleOpenAddModal}
                    className="flex items-center gap-2 px-6 py-3.5 bg-gradient-to-br from-primary to-primary-container text-white rounded-full font-bold shadow-lg shadow-primary/20 hover:shadow-xl hover:-translate-y-0.5 transition-all"
                >
                    <span className="material-symbols-outlined">add</span>
                    <span>Add New Device</span>
                </button>
            </div>

            {/* Main Content Area */}
            <div className="flex flex-col gap-6">
                <NetworkHealthCard devices={devices} />
                <DeviceTable
                    devices={filtered}
                    onDelete={handleDelete}
                    onEdit={handleOpenEditModal}
                    deletingId={deletingId}
                />
            </div>

            {/* Add/Edit Device Modal */}
            {isModalOpen && (
                <AddEditDeviceModal
                    key={editingDevice?.deviceId || "new"}
                    device={editingDevice}
                    onClose={handleCloseModal}
                    onSave={handleSaveDevice}
                    submitting={submitting}
                />
            )}
        </main>
    );
}
