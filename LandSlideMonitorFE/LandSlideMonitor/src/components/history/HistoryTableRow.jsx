import HistoryStatusBadge from "./HistoryStatusBadge";
import MoistureBar from "./MoistureBar";
import AccelerationCell from "./AccelerationCell";
import CoordinatesCell from "./CoordinatesCell";
import { formatRelativeTime } from "../../utils/time";
import { formatDateTime } from "../../utils/time";

export default function HistoryTableRow({ record }) {
    return (
        <tr className="hover:bg-surface-container-low/30 transition-colors group">
            {/* Timestamp */}
            <td className="px-6 py-4">
                <div className="flex flex-col">
                    <span className="text-sm font-semibold text-on-surface">
                        {formatDateTime(record.timestamp)}
                    </span>
                    <span className="text-[10px] text-on-surface-variant">
                        {formatRelativeTime(record.timestamp)}
                    </span>
                </div>
            </td>

            {/* Device ID */}
            <td className="px-6 py-4">
                <span className="inline-flex items-center px-2 py-1 bg-surface-container-high rounded text-xs font-mono font-medium text-primary">
                    {record.deviceId}
                </span>
            </td>

            {/* Status */}
            <td className="px-6 py-4 text-center">
                <HistoryStatusBadge status={record.status} />
            </td>

            {/* Moisture */}
            <td className="px-6 py-4">
                <MoistureBar
                    value={record.soilMoisture}
                    status={record.status}
                />
            </td>

            {/* Acceleration */}
            <td className="px-6 py-4">
                <AccelerationCell data={record} status={record.status} />
            </td>
            <td className="px-6 py-4">
                <CoordinatesCell
                    lat={record.latitude}
                    lon={record.longitude}
                    status={record.status}
                />
            </td>
        </tr>
    );
}
