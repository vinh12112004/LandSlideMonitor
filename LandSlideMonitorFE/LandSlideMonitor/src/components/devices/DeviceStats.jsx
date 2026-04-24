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
            value: sensors.filter((s) => s.status === 1).length,
            color: "#0F6E56",
        },
        {
            icon: "warning",
            label: "Lỗi / Mất KN",
            value: sensors.filter((s) => s.status === 2 || s.status === 3)
                .length,
            color: "#A32D2D",
        },
        {
            icon: "history",
            label: "Bản ghi lịch sử",
            value: history.length,
        },
    ];

    return (
        <div
            style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: 12,
                marginBottom: 28,
            }}
        >
            {stats.map((card) => (
                <div
                    key={card.label}
                    style={{
                        background: "var(--color-background-secondary)",
                        borderRadius: 10,
                        padding: "14px 16px",
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            marginBottom: 8,
                        }}
                    >
                        <span
                            className="material-symbols-outlined"
                            style={{
                                fontSize: 16,
                                color:
                                    card.color || "var(--color-text-secondary)",
                            }}
                        >
                            {card.icon}
                        </span>
                        <span
                            style={{
                                fontSize: 13,
                                color: "var(--color-text-secondary)",
                            }}
                        >
                            {card.label}
                        </span>
                    </div>
                    <span
                        style={{
                            fontSize: 24,
                            fontWeight: 500,
                            color: card.color || "var(--color-text-primary)",
                        }}
                    >
                        {card.value}
                    </span>
                </div>
            ))}
        </div>
    );
}
