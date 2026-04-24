import StatusBadge from "../ui/StatusBadge";

export default function DeviceDetailHeader({ device, formatTime, onBack }) {
    return (
        <div className="flex items-center gap-3 mb-6">
            <button
                onClick={onBack}
                className="flex items-center justify-center w-9 h-9 rounded-lg border border-outline-variant/70 text-on-surface-variant hover:text-on-surface hover:border-outline-variant transition"
            >
                <span className="material-symbols-outlined text-[18px]">
                    arrow_back
                </span>
            </button>

            <div className="flex-1">
                <div className="flex items-center gap-2">
                    <h1 className="m-0 text-[22px] font-semibold text-on-surface leading-tight">
                        {device.name}
                    </h1>
                    <StatusBadge status={device.status} />
                </div>
                <p className="mt-1 text-[13px] text-on-surface-variant">
                    ID: {device.deviceId} · {device.provinceName} · Lần cuối:{" "}
                    {formatTime(device.lastSeen)}
                </p>
            </div>
        </div>
    );
}
