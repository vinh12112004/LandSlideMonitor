import StatusBadge from "../ui/StatusBadge";
import { formatRelativeTime } from "../../utils/time";

export default function DeviceRow({
    device,
    onDelete,
    onEdit,
    deletingId,
    getProvinceName,
}) {
    const isDeleting = deletingId === device.deviceId;

    return (
        <tr
            className={`group hover:bg-surface-container-low transition-colors rounded-2xl ${isDeleting ? "opacity-50" : ""}`}
        >
            {/* Name */}
            <td className="px-6 py-5 rounded-l-2xl">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400">
                        <span className="material-symbols-outlined">
                            memory
                        </span>
                    </div>
                    <p className="font-bold text-on-surface">{device.name}</p>
                </div>
            </td>

            {/* Device ID */}
            <td className="px-6 py-5">
                <p className="text-xs text-on-surface-variant font-mono">
                    {device.deviceId}
                </p>
            </td>

            {/* Province */}
            <td className="px-6 py-5">
                <p className="text-sm text-on-surface-variant">
                    {device.provinceName
                        ? device.provinceName
                        : getProvinceName(device.provinceId)}
                </p>
            </td>

            {/* Status */}
            <td className="px-6 py-5 text-center">
                <StatusBadge status={device.status} />
            </td>

            {/* Last Seen */}
            <td className="px-6 py-5 text-on-surface-variant font-medium">
                {formatRelativeTime(device.lastSeen)}
            </td>

            {/* Actions */}
            <td className="px-6 py-5 text-right rounded-r-2xl">
                <button
                    onClick={() => onEdit(device)}
                    className="p-2 text-on-surface-variant hover:text-primary transition-colors"
                    title="Edit device"
                >
                    <span className="material-symbols-outlined">edit</span>
                </button>
                <button
                    onClick={() => onDelete(device.deviceId)}
                    disabled={isDeleting}
                    className="p-2 text-on-surface-variant hover:text-tertiary transition-colors disabled:cursor-not-allowed"
                    title="Delete device"
                >
                    <span
                        className={`material-symbols-outlined ${isDeleting ? "animate-spin" : ""}`}
                    >
                        {isDeleting ? "progress_activity" : "delete_outline"}
                    </span>
                </button>
            </td>
        </tr>
    );
}
