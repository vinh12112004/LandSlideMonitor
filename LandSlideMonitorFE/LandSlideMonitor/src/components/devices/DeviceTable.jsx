import { useNavigate } from "react-router-dom";
import DataTable from "../ui/DataTable";
import StatusBadge from "../ui/StatusBadge";
import { formatRelativeTime } from "../../utils/time";

export default function DeviceTable({
    devices,
    onDelete,
    onEdit,
    deletingId,
    loading,
}) {
    const navigate = useNavigate();

    const columns = [
        {
            key: "name",
            label: "Tên thiết bị",
            render: (value, row) => (
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-surface-container flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-on-surface-variant text-[18px]">
                            memory
                        </span>
                    </div>
                    <span className="font-semibold text-on-surface">
                        {value}
                    </span>
                </div>
            ),
        },
        {
            key: "deviceId",
            label: "Mã thiết bị",
            render: (value) => (
                <span className="font-mono text-xs text-on-surface-variant bg-surface-container px-2 py-1 rounded-md">
                    {value}
                </span>
            ),
        },
        {
            key: "provinceName",
            label: "Tỉnh / Thành phố",
            render: (value) => (
                <span className="text-sm text-on-surface-variant">
                    {value ?? "—"}
                </span>
            ),
        },
        {
            key: "status",
            label: "Trạng thái",
            align: "center",
            render: (value) => <StatusBadge status={value} />,
        },
        {
            key: "lastSeen",
            label: "Lần cuối hoạt động",
            render: (value) => (
                <span className="text-sm text-on-surface-variant">
                    {formatRelativeTime(value)}
                </span>
            ),
        },
        {
            key: "_actions",
            label: "",
            align: "right",
            render: (_, row) => {
                const isDeleting = deletingId === row.deviceId;
                return (
                    <div className="flex items-center justify-end gap-1">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onEdit(row);
                            }}
                            className="p-2 rounded-lg text-on-surface-variant hover:text-primary hover:bg-primary/5 transition-colors"
                            title="Chỉnh sửa"
                        >
                            <span className="material-symbols-outlined text-[18px]">
                                edit
                            </span>
                        </button>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onDelete(row.deviceId);
                            }}
                            disabled={isDeleting}
                            className="p-2 rounded-lg text-on-surface-variant hover:text-tertiary hover:bg-tertiary/5 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                            title="Xóa"
                        >
                            <span
                                className={`material-symbols-outlined text-[18px] ${isDeleting ? "animate-spin" : ""}`}
                            >
                                {isDeleting
                                    ? "progress_activity"
                                    : "delete_outline"}
                            </span>
                        </button>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/devices/${row.deviceId}`, {
                                    state: { device: row },
                                });
                            }}
                            className="p-2 rounded-lg text-primary hover:bg-primary/10 transition-colors"
                            title="Xem chi tiết"
                        >
                            <span className="material-symbols-outlined text-[18px]">
                                arrow_forward
                            </span>
                        </button>
                    </div>
                );
            },
        },
    ];

    return (
        <DataTable
            columns={columns}
            data={devices}
            rowKey="deviceId"
            loading={loading}
            emptyIcon="devices"
            emptyText="Không tìm thấy thiết bị nào."
        />
    );
}
