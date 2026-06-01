import { useState, useEffect, useCallback } from "react";
import NetworkHealthCard from "../components/devices/NetworkHealthCard";
import DeviceTable from "../components/devices/DeviceTable";
import deviceService from "../services/deviceService";
import { getConnection } from "../services/signalr";
import AddEditDeviceModal from "../components/devices/AddEditDeviceModal";
import { getProvinces } from "../services/provinceService";
import Pagination from "../components/common/Pagination";
import DeviceFilters from "../components/devices/DeviceFilters";
import { getCurrentUser } from "../services/authService";

export default function DevicesPage() {
    const [currentUser, setCurrentUser] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [devices, setDevices] = useState([]);
    const [allDevicesForHealthCard, setAllDevicesForHealthCard] = useState([]);
    const [provinces, setProvinces] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingDevice, setEditingDevice] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [deletingId, setDeletingId] = useState(null);
    const [filters, setFilters] = useState({
        provinceId: "all",
        status: "all",
    });
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalCount: 0,
        pageSize: 10,
    });

    const fetchDevices = useCallback(
        async (page = 1) => {
            if (!currentUser) return;

            try {
                setLoading(true);
                setError(null);

                let provinceIdToSend =
                    filters.provinceId === "all" ? null : filters.provinceId;
                if (currentUser.role === "Manager") {
                    if (
                        filters.provinceId !== "all" &&
                        !currentUser.provinceIds.includes(
                            parseInt(filters.provinceId),
                        )
                    ) {
                        provinceIdToSend = null;
                    }
                }

                const params = {
                    pageNumber: page,
                    pageSize: pagination.pageSize,
                    searchTerm: searchQuery,
                    provinceId: provinceIdToSend,
                    status: filters.status === "all" ? null : filters.status,
                };
                const result = await deviceService.getAll(params);
                setDevices(result.data);
                setPagination((prev) => ({
                    ...prev,
                    currentPage: result.currentPage,
                    totalPages: result.totalPages,
                    totalCount: result.totalCount,
                }));
            } catch (err) {
                setError("Không thể tải danh sách thiết bị. Vui lòng thử lại.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        },
        [pagination.pageSize, searchQuery, filters, currentUser],
    );

    const fetchAllDevicesForHealthCard = useCallback(async () => {
        if (!currentUser) return;
        try {
            // Lấy tất cả thiết bị, backend sẽ tự lọc theo quyền của user
            const result = await deviceService.getAll({
                pageNumber: 1,
                pageSize: 9999,
            });
            setAllDevicesForHealthCard(result.data);
        } catch (error) {
            console.error(
                "Failed to fetch all devices for health card:",
                error,
            );
        }
    }, [currentUser]);

    // Effect to initialize user and provinces
    useEffect(() => {
        const user = getCurrentUser();
        setCurrentUser(user);

        const fetchInitialProvinces = async () => {
            try {
                const data = await getProvinces();
                setProvinces(data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchInitialProvinces();
    }, []);

    // Effect for search and filter changes
    useEffect(() => {
        if (currentUser) {
            const timer = setTimeout(() => {
                fetchDevices(1); // Reset to page 1 on filter change
                fetchAllDevicesForHealthCard();
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [
        searchQuery,
        filters,
        currentUser,
        fetchDevices,
        fetchAllDevicesForHealthCard,
    ]);

    // Effect for page changes
    useEffect(() => {
        if (currentUser) {
            fetchDevices(pagination.currentPage);
        }
    }, [pagination.currentPage, currentUser, fetchDevices]);

    // Effect for SignalR updates
    useEffect(() => {
        const connection = getConnection();
        if (!connection) return;

        const handler = (data) => {
            // Update list in real-time
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
            // Also refresh health card data
            fetchAllDevicesForHealthCard();
        };

        connection.on("DeviceStatusChanged", handler);

        return () => {
            connection.off("DeviceStatusChanged", handler);
        };
    }, [fetchAllDevicesForHealthCard]);

    const userProvinces =
        currentUser?.role === "Admin"
            ? provinces
            : provinces.filter((p) => currentUser?.provinceIds.includes(p.id));

    const getProvinceName = (id) => {
        return provinces.find((p) => p.id === id)?.name || "Không rõ";
    };
    const handleFilterChange = (key, value) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
    };
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

    const handleDelete = async (id) => {
        if (!confirm(`Xóa thiết bị ${id}?`)) return;
        try {
            setDeletingId(id);
            await deviceService.delete(id);
            fetchDevices(pagination.currentPage);
            fetchAllDevicesForHealthCard(); // Refresh health card after delete
        } catch (err) {
            alert("Xóa thất bại. Vui lòng thử lại.");
            console.error(err);
        } finally {
            setDeletingId(null);
        }
    };

    const handleSaveDevice = async (deviceData) => {
        try {
            setSubmitting(true);
            if (editingDevice) {
                await deviceService.update(editingDevice.deviceId, deviceData);
            } else {
                await deviceService.create(deviceData);
            }
            fetchDevices(pagination.currentPage);
            fetchAllDevicesForHealthCard(); // Refresh health card after save
            handleCloseModal();
        } catch (err) {
            alert("Lưu thất bại. Vui lòng thử lại.");
            console.error(err);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading && devices.length === 0) {
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
                        onClick={() => fetchDevices(1)}
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
            <div className="flex justify-between items-end mb-12">
                <div>
                    <h2 className="text-4xl font-extrabold tracking-tight text-on-surface mb-2">
                        Quản lý thiết bị
                    </h2>
                    <p className="text-on-surface-variant font-body">
                        Quản lý và theo dõi tình trạng của mạng lưới cảm biến
                        địa chấn.
                    </p>
                </div>
                <button
                    onClick={handleOpenAddModal}
                    className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-br from-primary to-primary-container text-white rounded-full font-bold shadow-lg shadow-primary/20 hover:shadow-xl hover:-translate-y-0.5 transition-all whitespace-nowrap"
                >
                    <span className="material-symbols-outlined">add</span>
                    <span>Thêm thiết bị</span>
                </button>
            </div>

            <div className="flex flex-col gap-6">
                <NetworkHealthCard devices={allDevicesForHealthCard} />

                <DeviceFilters
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    provinces={userProvinces}
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    user={currentUser}
                />
                <div className="bg-surface-container-lowest rounded-3xl overflow-hidden shadow-sm border border-outline-variant/10">
                    <DeviceTable
                        devices={devices}
                        onDelete={handleDelete}
                        getProvinceName={getProvinceName}
                        onEdit={handleOpenEditModal}
                        deletingId={deletingId}
                    />

                    <Pagination
                        currentPage={pagination.currentPage}
                        totalPages={pagination.totalPages}
                        total={pagination.totalCount}
                        pageSize={pagination.pageSize}
                        onPageChange={(page) =>
                            setPagination((p) => ({ ...p, currentPage: page }))
                        }
                    />
                </div>
            </div>

            {isModalOpen && (
                <AddEditDeviceModal
                    key={editingDevice?.deviceId || "new"}
                    device={editingDevice}
                    provinces={userProvinces}
                    onClose={handleCloseModal}
                    onSave={handleSaveDevice}
                    submitting={submitting}
                />
            )}
        </main>
    );
}
