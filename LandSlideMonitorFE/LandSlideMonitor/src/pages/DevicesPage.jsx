import { useMemo, useState } from "react";
import AddEditDeviceModal from "../components/devices/AddEditDeviceModal";
import DeviceFilters from "../components/devices/DeviceFilters";
import DeviceTable from "../components/devices/DeviceTable";
import NetworkHealthCard from "../components/devices/NetworkHealthCard";
import Pagination from "../components/common/Pagination";
import Button from "../components/ui/Button";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import EmptyState from "../components/ui/EmptyState";
import LoadingState from "../components/ui/LoadingState";
import { useDevices } from "../features/devices/useDevices";
import { useProvinces } from "../hooks/useProvinces";

export default function DevicesPage({ user }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingDevice, setEditingDevice] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const { provinces } = useProvinces();
    const {
        devices,
        healthDevices,
        loading,
        error,
        mutationError,
        setMutationError,
        submitting,
        deletingId,
        query,
        pagination,
        setSearchQuery,
        setFilter,
        setPage,
        saveDevice,
        deleteDevice,
        refetch,
    } = useDevices(user);

    const userProvinces = useMemo(() => {
        if (user?.role === "Admin") return provinces;
        return provinces.filter((province) =>
            user?.provinceIds?.includes(province.id),
        );
    }, [provinces, user]);

    const openAddModal = () => {
        setEditingDevice(null);
        setIsModalOpen(true);
        setMutationError(null);
    };

    const openEditModal = (device) => {
        setEditingDevice(device);
        setIsModalOpen(true);
        setMutationError(null);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingDevice(null);
    };

    const handleSaveDevice = async (deviceData) => {
        const saved = await saveDevice(deviceData, editingDevice);
        if (saved) closeModal();
    };

    const handleConfirmDelete = async () => {
        if (!deleteTarget) return;
        const deleted = await deleteDevice(deleteTarget.deviceId);
        if (deleted) setDeleteTarget(null);
    };

    if (loading && devices.length === 0) {
        return (
            <section className="page-shell">
                <LoadingState message="Đang tải thiết bị..." />
            </section>
        );
    }

    if (error) {
        return (
            <section className="page-shell">
                <EmptyState
                    icon="error_outline"
                    title="Có lỗi xảy ra"
                    description={error}
                    actionLabel="Thử lại"
                    onAction={refetch}
                />
            </section>
        );
    }

    return (
        <section className="page-shell">
            <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div>
                    <p className="mb-2 text-xs font-bold uppercase tracking-widest text-primary">
                        Device Network
                    </p>
                    <h1 className="text-3xl font-extrabold tracking-tight text-on-surface md:text-4xl">
                        Quản lý thiết bị
                    </h1>
                    <p className="mt-2 max-w-2xl text-sm text-on-surface-variant">
                        Quản lý và theo dõi tình trạng của mạng lưới cảm biến
                        địa chấn.
                    </p>
                </div>
                <Button onClick={openAddModal} className="md:self-center">
                    <span className="material-symbols-outlined" aria-hidden="true">
                        add
                    </span>
                    Thêm thiết bị
                </Button>
            </div>

            {mutationError && (
                <div
                    className="mb-5 rounded-lg border border-error/20 bg-error-container/25 px-4 py-3 text-sm font-medium text-on-error-container"
                    role="alert"
                >
                    {mutationError}
                </div>
            )}

            <div className="space-y-6">
                <NetworkHealthCard devices={healthDevices} />

                <DeviceFilters
                    filters={{
                        provinceId: query.provinceId,
                        status: query.status,
                    }}
                    onFilterChange={setFilter}
                    provinces={userProvinces}
                    searchQuery={query.searchTerm}
                    onSearchChange={setSearchQuery}
                    user={user}
                />

                <div>
                    <DeviceTable
                        devices={devices}
                        onDelete={setDeleteTarget}
                        onEdit={openEditModal}
                        deletingId={deletingId}
                        loading={loading}
                    />
                    <Pagination
                        currentPage={pagination.currentPage}
                        totalPages={pagination.totalPages}
                        total={pagination.totalCount}
                        pageSize={pagination.pageSize}
                        onPageChange={setPage}
                    />
                </div>
            </div>

            {isModalOpen && (
                <AddEditDeviceModal
                    key={editingDevice?.deviceId || "new"}
                    device={editingDevice}
                    provinces={userProvinces}
                    onClose={closeModal}
                    onSave={handleSaveDevice}
                    submitting={submitting}
                />
            )}

            <ConfirmDialog
                open={Boolean(deleteTarget)}
                title="Xóa thiết bị?"
                description={`Bạn có chắc muốn xóa thiết bị ${deleteTarget?.deviceId ?? ""}?`}
                confirmLabel="Xóa"
                isLoading={Boolean(deletingId)}
                onClose={() => setDeleteTarget(null)}
                onConfirm={handleConfirmDelete}
            />
        </section>
    );
}
