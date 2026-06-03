import Card from "../ui/Card";

export default function DeviceStats({ sensors, history }) {
    const stats = [
        {
            icon: "sensors",
            label: "Tổng sensor",
            value: sensors.length,
        },
        {
            icon: "check_circle",
            label: "Hoạt động",
            value: sensors.filter((sensor) => sensor.status === 1).length,
            className: "text-emerald-700 bg-emerald-50",
        },
        {
            icon: "warning",
            label: "Lỗi / Mất KN",
            value: sensors.filter(
                (sensor) => sensor.status === 2 || sensor.status === 3,
            ).length,
            className: "text-red-700 bg-red-50",
        },
        {
            icon: "history",
            label: "Bản ghi lịch sử",
            value: history.length,
        },
    ];

    return (
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((card) => (
                <Card key={card.label} className="px-5 py-4">
                    <div className="flex items-center gap-3">
                        <div
                            className={`flex h-10 w-10 items-center justify-center rounded-lg ${card.className ?? "bg-surface-container text-on-surface-variant"}`}
                        >
                            <span
                                className="material-symbols-outlined text-[20px]"
                                aria-hidden="true"
                            >
                                {card.icon}
                            </span>
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-on-surface-variant">
                                {card.label}
                            </p>
                            <p className="mt-1 text-2xl font-extrabold tabular-nums text-on-surface">
                                {card.value}
                            </p>
                        </div>
                    </div>
                </Card>
            ))}
        </div>
    );
}
