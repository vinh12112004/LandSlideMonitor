import { useState } from "react";
import { SENSOR_LABELS } from "../../constants/sensorConfig";
const JsonViewer = ({ data }) => {
    const [expanded, setExpanded] = useState(false);
    let parsed;
    try {
        parsed = JSON.parse(data);
    } catch {
        parsed = data;
    }

    return (
        <div style={{ marginTop: 8 }}>
            <button
                onClick={() => setExpanded((e) => !e)}
                style={{
                    background: "var(--color-background-secondary)",
                    border: "0.5px solid var(--color-border-tertiary)",
                    borderRadius: 6,
                    padding: "4px 10px",
                    fontSize: 12,
                    cursor: "pointer",
                    color: "var(--color-text-secondary)",
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                }}
            >
                <span
                    className="material-symbols-outlined"
                    style={{ fontSize: 14 }}
                >
                    {expanded ? "expand_less" : "data_object"}
                </span>
                {expanded ? "Ẩn " : "Xem chi tiết dữ liệu"}
            </button>
            {expanded && parsed && typeof parsed === "object" && (
                <div
                    style={{
                        marginTop: 8,
                        display: "grid",
                        gridTemplateColumns:
                            "repeat(auto-fit, minmax(150px, 1fr))",
                        gap: 8,
                    }}
                >
                    {Object.entries(parsed).map(([key, value]) => {
                        const meta = SENSOR_LABELS[key];
                        const displayValue =
                            typeof value === "number"
                                ? value % 1 !== 0
                                    ? value.toFixed(3)
                                    : value
                                : String(value);

                        return (
                            <div
                                key={key}
                                style={{
                                    background:
                                        "var(--color-background-secondary)",
                                    border: "0.5px solid var(--color-border-tertiary)",
                                    borderRadius: 10,
                                    padding: "8px 10px",
                                }}
                            >
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 6,
                                        marginBottom: 4,
                                    }}
                                >
                                    {meta?.icon && (
                                        <span
                                            className="material-symbols-outlined"
                                            style={{
                                                fontSize: 14,
                                                color: "var(--color-primary)",
                                            }}
                                        >
                                            {meta.icon}
                                        </span>
                                    )}
                                    <span
                                        style={{
                                            fontSize: 10,
                                            textTransform: "uppercase",
                                            letterSpacing: 1,
                                            color: "var(--color-text-secondary)",
                                            fontWeight: 500,
                                        }}
                                    >
                                        {meta?.label ?? key}
                                    </span>
                                </div>
                                <div
                                    style={{
                                        fontSize: 13,
                                        fontWeight: 700,
                                        color: "var(--color-text-primary)",
                                    }}
                                >
                                    {displayValue}
                                    {meta?.unit ? (
                                        <span
                                            style={{
                                                fontSize: 11,
                                                fontWeight: 400,
                                                color: "var(--color-text-secondary)",
                                                marginLeft: 4,
                                            }}
                                        >
                                            {meta.unit}
                                        </span>
                                    ) : null}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default JsonViewer;
