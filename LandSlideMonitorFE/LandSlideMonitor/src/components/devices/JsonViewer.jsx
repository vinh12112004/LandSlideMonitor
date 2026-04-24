import { useState } from "react";

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
                {expanded ? "Ẩn JSON" : "Xem dữ liệu JSON"}
            </button>
            {expanded && (
                <pre
                    style={{
                        marginTop: 8,
                        padding: "12px 14px",
                        background: "var(--color-background-secondary)",
                        border: "0.5px solid var(--color-border-tertiary)",
                        borderRadius: 8,
                        fontSize: 12,
                        lineHeight: 1.6,
                        overflow: "auto",
                        maxHeight: 200,
                        color: "var(--color-text-primary)",
                        fontFamily: "var(--font-mono)",
                    }}
                >
                    {JSON.stringify(parsed, null, 2)}
                </pre>
            )}
        </div>
    );
};

export default JsonViewer;
