const SENSOR_TYPE_ICON = {
    1: "vibration",
    2: "water_drop",
    3: "rainy",
    4: "satellite_alt",
};
const SENSOR_STATUS_CONFIG = {
    0: {
        label: "Không hoạt động",
        color: "var(--c-gray-400)",
        bg: "var(--c-gray-50)",
        text: "var(--c-gray-700)",
    },
    1: { label: "Hoạt động", color: "#1D9E75", bg: "#E1F5EE", text: "#0F6E56" },
    2: { label: "Lỗi", color: "#E24B4A", bg: "#FCEBEB", text: "#A32D2D" },
    3: {
        label: "Mất kết nối",
        color: "#BA7517",
        bg: "#FAEEDA",
        text: "#854F0B",
    },
};

export default function SensorList({
    sensors,
    loading,
    onAdd,
    onEdit,
    onDelete,
}) {
    return (
        <div>
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 16,
                }}
            >
                <p
                    style={{
                        margin: 0,
                        fontSize: 13,
                        color: "var(--color-text-secondary)",
                    }}
                >
                    {sensors.length} sensor được gắn với thiết bị này
                </p>
                <button
                    onClick={onAdd}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        padding: "8px 16px",
                        background: "#185FA5",
                        color: "#fff",
                        border: "none",
                        borderRadius: 8,
                        cursor: "pointer",
                        fontSize: 14,
                        fontWeight: 500,
                    }}
                >
                    <span
                        className="material-symbols-outlined"
                        style={{ fontSize: 16 }}
                    >
                        add
                    </span>
                    Thêm sensor
                </button>
            </div>

            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 10,
                }}
            >
                {sensors.length === 0 && !loading && (
                    <div
                        style={{
                            textAlign: "center",
                            padding: "48px 0",
                            background: "var(--color-background-primary)",
                            borderRadius: 12,
                            border: "0.5px solid var(--color-border-tertiary)",
                        }}
                    >
                        <span
                            className="material-symbols-outlined"
                            style={{
                                fontSize: 40,
                                color: "var(--color-text-secondary)",
                                display: "block",
                                marginBottom: 10,
                            }}
                        >
                            sensors_off
                        </span>
                        <p
                            style={{
                                color: "var(--color-text-secondary)",
                                margin: 0,
                            }}
                        >
                            Chưa có sensor nào
                        </p>
                    </div>
                )}
                {sensors.map((sensor) => {
                    const sCfg =
                        SENSOR_STATUS_CONFIG[sensor.status] ||
                        SENSOR_STATUS_CONFIG[0];
                    console.log(
                        "Sensor",
                        sensor.id,
                        "status",
                        sensor.status,
                        sCfg,
                    );
                    return (
                        <div
                            key={sensor.id}
                            style={{
                                background: "var(--color-background-primary)",
                                border: "0.5px solid var(--color-border-tertiary)",
                                borderRadius: 12,
                                padding: "16px 20px",
                                display: "flex",
                                alignItems: "center",
                                gap: 16,
                            }}
                        >
                            {/* icon */}
                            <div
                                style={{
                                    width: 44,
                                    height: 44,
                                    borderRadius: 10,
                                    background: "#E6F1FB",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    flexShrink: 0,
                                }}
                            >
                                <span
                                    className="material-symbols-outlined"
                                    style={{
                                        fontSize: 22,
                                        color: "#185FA5",
                                    }}
                                >
                                    {SENSOR_TYPE_ICON[sensor.type] || "sensors"}
                                </span>
                            </div>

                            {/* info */}
                            <div style={{ flex: 1 }}>
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 8,
                                        marginBottom: 4,
                                    }}
                                >
                                    <span
                                        style={{
                                            fontWeight: 500,
                                            fontSize: 15,
                                            color: "var(--color-text-primary)",
                                        }}
                                    >
                                        {sensor.name}
                                    </span>
                                    <span
                                        style={{
                                            padding: "2px 8px",
                                            borderRadius: 999,
                                            background: sCfg.bg,
                                            color: sCfg.text,
                                            border: `1px solid ${sCfg.color || "#94A3B8"}`,
                                            fontSize: 11,
                                            fontWeight: 600,
                                        }}
                                    >
                                        {sCfg.label}
                                    </span>
                                </div>
                                <div
                                    style={{
                                        display: "flex",
                                        flexWrap: "wrap",
                                        gap: 10,
                                        fontSize: 13,
                                        color: "var(--color-text-secondary)",
                                    }}
                                >
                                    <span>
                                        <span
                                            className="material-symbols-outlined"
                                            style={{
                                                fontSize: 13,
                                                verticalAlign: "middle",
                                                marginRight: 3,
                                            }}
                                        >
                                            qr_code
                                        </span>
                                        {sensor.sensorCode}
                                    </span>

                                    <span
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 6,
                                        }}
                                    >
                                        <span
                                            className="material-symbols-outlined"
                                            style={{
                                                fontSize: 13,
                                                verticalAlign: "middle",
                                            }}
                                        >
                                            category
                                        </span>
                                        {(sensor.channels || []).length > 0 ? (
                                            <span
                                                style={{
                                                    display: "flex",
                                                    flexWrap: "wrap",
                                                    gap: 6,
                                                }}
                                            >
                                                {sensor.channels.map((c) => (
                                                    <span
                                                        key={c.id}
                                                        style={{
                                                            padding: "2px 8px",
                                                            borderRadius: 999,
                                                            background:
                                                                "#F2F6FF",
                                                            color: "#185FA5",
                                                            border: "1px solid #D6E4FF",
                                                            fontSize: 12,
                                                        }}
                                                    >
                                                        {c.channelName}
                                                    </span>
                                                ))}
                                            </span>
                                        ) : (
                                            <span>Chưa gán channel</span>
                                        )}
                                    </span>
                                    {/* 
                                    <span
                                        style={{
                                            color: "var(--color-text-secondary)",
                                            fontSize: 12,
                                        }}
                                    >
                                        ID: {sensor.id}
                                    </span> */}
                                </div>
                            </div>

                            {/* actions */}
                            <div style={{ display: "flex", gap: 6 }}>
                                <button
                                    onClick={() => onEdit(sensor)}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 4,
                                        padding: "6px 12px",
                                        borderRadius: 8,
                                        cursor: "pointer",
                                        fontSize: 13,
                                        background: "none",
                                        border: "0.5px solid var(--color-border-secondary)",
                                        color: "var(--color-text-secondary)",
                                    }}
                                >
                                    <span
                                        className="material-symbols-outlined"
                                        style={{ fontSize: 15 }}
                                    >
                                        edit
                                    </span>
                                    Sửa
                                </button>
                                <button
                                    onClick={() => onDelete(sensor)}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 4,
                                        padding: "6px 12px",
                                        borderRadius: 8,
                                        cursor: "pointer",
                                        fontSize: 13,
                                        background: "none",
                                        border: "0.5px solid #F7C1C1",
                                        color: "#A32D2D",
                                    }}
                                >
                                    <span
                                        className="material-symbols-outlined"
                                        style={{ fontSize: 15 }}
                                    >
                                        delete
                                    </span>
                                    Xóa
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
