import { useMemo, useState } from "react";
import Badge from "../ui/Badge";
import DataTable from "../ui/DataTable";
import { formatDateTime } from "../../utils/time";

const ACTION_VARIANTS = {
    CREATE: "success",
    UPDATE: "info",
    DELETE: "danger",
};

const ACTION_LABELS = {
    CREATE: "Tạo",
    UPDATE: "Cập nhật",
    DELETE: "Xóa",
};

function AuditActionBadge({ action }) {
    return (
        <Badge variant={ACTION_VARIANTS[action] || "neutral"} dot>
            {ACTION_LABELS[action] || "Không rõ"}
        </Badge>
    );
}

function parseJsonObject(value) {
    if (!value) return { type: "empty", value: null };

    try {
        const data = JSON.parse(value);
        if (!data || typeof data !== "object" || Array.isArray(data)) {
            return { type: "raw", value };
        }

        return { type: "json", value: data };
    } catch {
        return { type: "raw", value };
    }
}

function stringifyValue(value) {
    if (value === null || value === undefined) return "—";
    if (typeof value === "object") return JSON.stringify(value);
    return String(value);
}

function valuesAreEqual(oldValue, newValue) {
    return JSON.stringify(oldValue) === JSON.stringify(newValue);
}

function RawFallback({ oldValues, newValues }) {
    return (
        <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-lg border border-outline-variant/20 bg-surface-container-lowest px-4 py-3">
                <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                    Giá trị cũ
                </p>
                {oldValues ? (
                    <pre className="max-h-64 overflow-auto whitespace-pre-wrap break-words rounded-md bg-surface-container px-3 py-2 font-mono text-xs text-on-surface-variant">
                        {oldValues}
                    </pre>
                ) : (
                    <p className="text-sm italic text-on-surface-variant/55">
                        Không có dữ liệu
                    </p>
                )}
            </div>
            <div className="rounded-lg border border-outline-variant/20 bg-surface-container-lowest px-4 py-3">
                <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                    Giá trị mới
                </p>
                {newValues ? (
                    <pre className="max-h-64 overflow-auto whitespace-pre-wrap break-words rounded-md bg-surface-container px-3 py-2 font-mono text-xs text-on-surface-variant">
                        {newValues}
                    </pre>
                ) : (
                    <p className="text-sm italic text-on-surface-variant/55">
                        Không có dữ liệu
                    </p>
                )}
            </div>
        </div>
    );
}

function FieldValues({ oldValues, newValues }) {
    const oldParsed = useMemo(() => parseJsonObject(oldValues), [oldValues]);
    const newParsed = useMemo(() => parseJsonObject(newValues), [newValues]);

    if (oldParsed.type === "raw" || newParsed.type === "raw") {
        return <RawFallback oldValues={oldValues} newValues={newValues} />;
    }

    const oldData = oldParsed.type === "json" ? oldParsed.value : {};
    const newData = newParsed.type === "json" ? newParsed.value : {};
    const keys = Array.from(
        new Set([...Object.keys(oldData), ...Object.keys(newData)]),
    );
    const entries = keys.map((key) => ({
        key,
        oldValue: oldData[key],
        newValue: newData[key],
    }));

    if (entries.length === 0) {
        return (
            <div className="rounded-lg border border-outline-variant/20 bg-surface-container-lowest px-4 py-3">
                <p className="text-sm italic text-on-surface-variant/55">
                    Không có dữ liệu
                </p>
            </div>
        );
    }

    return (
        <div className="overflow-hidden rounded-lg border border-outline-variant/20 bg-surface-container-lowest">
            <div className="grid grid-cols-[minmax(110px,0.8fr)_minmax(0,1fr)_minmax(0,1fr)] border-b border-outline-variant/20 bg-surface-container px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                <span>Trường</span>
                <span>Giá trị cũ</span>
                <span>Giá trị mới</span>
            </div>
            {entries.map(({ key, oldValue, newValue }) => {
                const changed = !valuesAreEqual(oldValue, newValue);

                return (
                    <div
                        key={key}
                        className={`grid grid-cols-[minmax(110px,0.8fr)_minmax(0,1fr)_minmax(0,1fr)] gap-3 border-b border-outline-variant/15 px-3 py-2 text-xs last:border-b-0 ${
                            changed ? "bg-amber-500/[.05]" : ""
                        }`}
                    >
                        <span className="min-w-0 truncate font-semibold text-on-surface">
                            {key}
                        </span>
                        <span className="min-w-0 break-words font-mono text-on-surface-variant">
                            {stringifyValue(oldValue)}
                        </span>
                        <span className="min-w-0 break-words font-mono text-on-surface-variant">
                            {stringifyValue(newValue)}
                        </span>
                    </div>
                );
            })}
        </div>
    );
}

function AuditDetailRow({ log }) {
    return (
        <div className="bg-surface-container-low/55 px-4 py-3">
            <FieldValues oldValues={log.oldValues} newValues={log.newValues} />
        </div>
    );
}

export default function AuditLogTable({ logs, loading }) {
    const [expandedId, setExpandedId] = useState(null);

    const columns = useMemo(
        () => [
            {
                key: "createdAt",
                label: "Thời gian",
                render: (value) => (
                    <span className="whitespace-nowrap text-sm text-on-surface-variant">
                        {formatDateTime(value)}
                    </span>
                ),
            },
            {
                key: "userId",
                label: "ID người dùng",
                render: (value) => (
                    <span className="font-mono text-xs text-on-surface-variant">
                        {value || "—"}
                    </span>
                ),
            },
            {
                key: "actionType",
                label: "Hành động",
                render: (value) => <AuditActionBadge action={value} />,
            },
            {
                key: "entityType",
                label: "Đối tượng",
                render: (value) => (
                    <span className="font-semibold text-on-surface">
                        {value || "—"}
                    </span>
                ),
            },
            {
                key: "_expand",
                label: "",
                align: "right",
                render: (_, row) => (
                    <span
                        className={`material-symbols-outlined text-[18px] text-on-surface-variant transition-transform duration-200 ${
                            expandedId === row.id ? "rotate-180" : ""
                        }`}
                        aria-hidden="true"
                    >
                        expand_more
                    </span>
                ),
            },
        ],
        [expandedId],
    );

    return (
        <DataTable
            columns={columns}
            data={logs}
            rowKey="id"
            loading={loading}
            emptyIcon="history"
            emptyTitle="Chưa có nhật ký"
            emptyText="Chưa có bản ghi audit log nào trong hệ thống."
            onRowClick={(row) =>
                setExpandedId((current) => (current === row.id ? null : row.id))
            }
            isRowExpanded={(row) => expandedId === row.id}
            expandedRowRender={(row) => <AuditDetailRow log={row} />}
        />
    );
}
