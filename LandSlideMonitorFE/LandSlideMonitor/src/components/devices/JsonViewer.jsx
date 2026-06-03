import { useMemo, useState } from "react";
import { SENSOR_LABELS } from "../../constants/sensorConfig";
import Button from "../ui/Button";

const JsonViewer = ({ data }) => {
    const [expanded, setExpanded] = useState(false);
    const parsed = useMemo(() => {
        try {
            return JSON.parse(data);
        } catch {
            return data;
        }
    }, [data]);

    return (
        <div className="mt-3">
            <Button
                variant="outline"
                size="sm"
                onClick={() => setExpanded((value) => !value)}
                aria-expanded={expanded}
            >
                <span
                    className="material-symbols-outlined text-[16px]"
                    aria-hidden="true"
                >
                    {expanded ? "expand_less" : "data_object"}
                </span>
                {expanded ? "Ẩn" : "Xem chi tiết dữ liệu"}
            </Button>
            {expanded && parsed && typeof parsed === "object" && (
                <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
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
                                className="rounded-lg border border-outline-variant/25 bg-surface-container-low px-3 py-2"
                            >
                                <div className="mb-1 flex items-center gap-1.5">
                                    {meta?.icon && (
                                        <span
                                            className="material-symbols-outlined text-[14px] text-primary"
                                            aria-hidden="true"
                                        >
                                            {meta.icon}
                                        </span>
                                    )}
                                    <span className="truncate text-[10px] font-semibold uppercase tracking-wider text-on-surface-variant">
                                        {meta?.label ?? key}
                                    </span>
                                </div>
                                <div className="text-sm font-bold text-on-surface">
                                    {displayValue}
                                    {meta?.unit ? (
                                        <span className="ml-1 text-xs font-normal text-on-surface-variant">
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
