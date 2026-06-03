import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DeleteConfirmModal from "../components/devices/DeleteConfirmModal";
import DeviceDetailHeader from "../components/devices/DeviceDetailHeader";
import DeviceStats from "../components/devices/DeviceStats";
import HistoryList from "../components/devices/HistoryList";
import SensorList from "../components/devices/SensorList";
import SensorModal from "../components/devices/SensorModal";
import EmptyState from "../components/ui/EmptyState";
import LoadingState from "../components/ui/LoadingState";
import { TabButton, Tabs } from "../components/ui/Tabs";
import { useDeviceDetail } from "../features/device-detail/useDeviceDetail";

export default function DeviceDetailPage() {
    const { deviceId } = useParams();
    const navigate = useNavigate();
    const [modal, setModal] = useState(null);
    const [tab, setTab] = useState("sensors");
    const {
        device,
        sensors,
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
        historyPageSize,
        saveSensor,
        removeSensor,
        formatTime,
        refetch,
    } = useDeviceDetail(deviceId);

    const handleSaveSensor = async (formData, sensorId) => {
        const saved = await saveSensor(formData, sensorId);
        if (saved) setModal(null);
    };

    const handleDeleteSensor = async (sensorId) => {
        const deleted = await removeSensor(sensorId);
        if (deleted) setModal(null);
    };

    if (loading && !device) {
        return (
            <section className="page-shell">
                <LoadingState message="Đang tải dữ liệu thiết bị..." />
            </section>
        );
    }

    if (error) {
        return (
            <section className="page-shell">
                <EmptyState
                    icon="error_outline"
                    title="Không thể tải thiết bị"
                    description={error}
                    actionLabel="Thử lại"
                    onAction={refetch}
                />
            </section>
        );
    }

    if (!device) {
        return (
            <section className="page-shell">
                <EmptyState
                    icon="devices"
                    title="Không tìm thấy thiết bị"
                    description="Thiết bị không tồn tại hoặc bạn không có quyền truy cập."
                    actionLabel="Quay lại danh sách"
                    onAction={() => navigate("/devices")}
                />
            </section>
        );
    }

    return (
        <section className="page-shell">
            <DeviceDetailHeader
                device={device}
                formatTime={formatTime}
                onBack={() => navigate("/devices")}
            />

            {mutationError && (
                <div
                    className="mb-5 rounded-lg border border-error/20 bg-error-container/25 px-4 py-3 text-sm font-medium text-on-error-container"
                    role="alert"
                >
                    {mutationError}
                </div>
            )}

            <DeviceStats sensors={sensors} history={history} />

            <Tabs label="Chi tiết thiết bị" className="mb-6">
                <TabButton
                    active={tab === "sensors"}
                    icon="sensors"
                    onClick={() => setTab("sensors")}
                >
                    Quản lý Sensor
                </TabButton>
                <TabButton
                    active={tab === "history"}
                    icon="history"
                    onClick={() => setTab("history")}
                >
                    Lịch sử dữ liệu
                </TabButton>
            </Tabs>

            {tab === "sensors" && (
                <SensorList
                    sensors={sensors}
                    loading={loading}
                    onAdd={() => {
                        setMutationError(null);
                        setModal({ type: "add" });
                    }}
                    onEdit={(sensor) => {
                        setMutationError(null);
                        setModal({ type: "edit", sensor });
                    }}
                    onDelete={(sensor) => {
                        setMutationError(null);
                        setModal({ type: "delete", sensor });
                    }}
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
        </section>
    );
}
