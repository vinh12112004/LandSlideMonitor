import { SENSOR_STATUS_CONFIG, SENSOR_TYPE_ICON } from "../../constants/sensorConfig";
import Badge from "../ui/Badge";
import Button from "../ui/Button";
import EmptyState from "../ui/EmptyState";

export default function SensorList({
    sensors,
    loading,
    onAdd,
    onEdit,
    onDelete,
}) {
    return (
        <div className="space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-on-surface-variant">
                    {sensors.length} sensor được gắn với thiết bị này
                </p>
                <Button onClick={onAdd}>
                    <span
                        className="material-symbols-outlined text-[18px]"
                        aria-hidden="true"
                    >
                        add
                    </span>
                    Thêm sensor
                </Button>
            </div>

            {sensors.length === 0 && !loading ? (
                <EmptyState
                    icon="sensors_off"
                    title="Chưa có sensor"
                    description="Thiết bị này chưa được gắn sensor nào."
                />
            ) : (
                <div className="space-y-3">
                    {sensors.map((sensor) => {
                        const status =
                            SENSOR_STATUS_CONFIG[sensor.status] ||
                            SENSOR_STATUS_CONFIG[0];
                        return (
                            <article
                                key={sensor.id}
                                className="rounded-lg border border-outline-variant/30 bg-surface-container-lowest p-4 shadow-sm"
                            >
                                <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
                                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary-container/20 text-primary">
                                        <span
                                            className="material-symbols-outlined text-[22px]"
                                            aria-hidden="true"
                                        >
                                            {SENSOR_TYPE_ICON[sensor.type] ||
                                                "sensors"}
                                        </span>
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <div className="mb-2 flex flex-wrap items-center gap-2">
                                            <h2 className="truncate text-sm font-bold text-on-surface">
                                                {sensor.name}
                                            </h2>
                                            <Badge
                                                className="ring-1"
                                                style={{
                                                    background: status.bg,
                                                    color: status.text,
                                                }}
                                            >
                                                {status.label}
                                            </Badge>
                                        </div>
                                        <div className="flex flex-wrap items-center gap-2 text-sm text-on-surface-variant">
                                            <span className="inline-flex items-center gap-1 rounded-md bg-surface-container px-2 py-1 font-mono text-xs">
                                                <span
                                                    className="material-symbols-outlined text-[14px]"
                                                    aria-hidden="true"
                                                >
                                                    qr_code
                                                </span>
                                                {sensor.sensorCode}
                                            </span>
                                            {(sensor.channels || []).length > 0 ? (
                                                sensor.channels.map((channel) => (
                                                    <span
                                                        key={channel.id}
                                                        className="rounded-full bg-primary-container/20 px-2.5 py-1 text-xs font-semibold text-primary"
                                                    >
                                                        {channel.channelName}
                                                    </span>
                                                ))
                                            ) : (
                                                <span>Chưa gán channel</span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex justify-end gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => onEdit(sensor)}
                                        >
                                            <span
                                                className="material-symbols-outlined text-[16px]"
                                                aria-hidden="true"
                                            >
                                                edit
                                            </span>
                                            Sửa
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="text-error hover:text-error"
                                            onClick={() => onDelete(sensor)}
                                        >
                                            <span
                                                className="material-symbols-outlined text-[16px]"
                                                aria-hidden="true"
                                            >
                                                delete
                                            </span>
                                            Xóa
                                        </Button>
                                    </div>
                                </div>
                            </article>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
