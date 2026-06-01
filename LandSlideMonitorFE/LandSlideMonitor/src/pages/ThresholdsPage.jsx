import { useEffect, useMemo, useState } from "react";
import thresholdService from "../services/thresholdService";
import channelDefinitionService from "../services/channelDefinitionService";
import ThresholdModal from "../components/thresholds/ThresholdModal";
import SensorTypeModal from "../components/thresholds/SensorTypeModal";
import DataTable from "../components/ui/DataTable";

// ── Constants ────────────────────────────────────────────────────────────────
const LEVELS = [
    {
        value: 0,
        label: "Bình thường",
        color: "text-emerald-700 bg-emerald-50 ring-emerald-200",
    },
    {
        value: 1,
        label: "Cảnh báo",
        color: "text-amber-700 bg-amber-50 ring-amber-200",
    },
    {
        value: 2,
        label: "Nguy hiểm",
        color: "text-rose-700 bg-rose-50 ring-rose-200",
    },
];

// ── Small UI helpers ─────────────────────────────────────────────────────────
function LevelBadge({ value }) {
    const type = LEVELS.find((x) => x.value === value);
    if (!type) return null;
    return (
        <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ring-1 ${type.color}`}
        >
            <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
            {type.label}
        </span>
    );
}

function RowActions({ onEdit, onDelete }) {
    return (
        <div className="flex items-center justify-end gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
                onClick={onEdit}
                className="p-1.5 rounded-lg text-primary hover:bg-primary/8 transition-colors"
                title="Chỉnh sửa"
            >
                <span className="material-symbols-outlined text-[17px]">
                    edit
                </span>
            </button>
            <button
                onClick={onDelete}
                className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 transition-colors"
                title="Xóa"
            >
                <span className="material-symbols-outlined text-[17px]">
                    delete
                </span>
            </button>
        </div>
    );
}

// ── Tab button ───────────────────────────────────────────────────────────────
function Tab({ active, icon, label, onClick }) {
    return (
        <button
            onClick={onClick}
            className={`flex items-center gap-1.5 px-4 py-3 text-sm font-semibold border-b-2 -mb-px transition ${
                active
                    ? "border-primary text-primary"
                    : "border-transparent text-on-surface-variant hover:text-on-surface"
            }`}
        >
            <span className="material-symbols-outlined text-[16px]">
                {icon}
            </span>
            {label}
        </button>
    );
}

// ── Main Page ────────────────────────────────────────────────────────────────
export default function ThresholdsPage() {
    const [thresholds, setThresholds] = useState([]);
    const [channelDefinitions, setChannelDefinitions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [channelsLoading, setChannelsLoading] = useState(false);
    const [error, setError] = useState(null);

    const [tab, setTab] = useState("thresholds");
    const [filterType, setFilterType] = useState("all");

    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const [typeModalOpen, setTypeModalOpen] = useState(false);
    const [editingType, setEditingType] = useState(null);
    const [typeSubmitting, setTypeSubmitting] = useState(false);

    // ── Data fetching ────────────────────────────────────────────────────────
    useEffect(() => {
        fetchThresholds();
        fetchChannelDefinitions();
    }, []);

    const fetchThresholds = async () => {
        try {
            setLoading(true);
            const data = await thresholdService.getAll();
            setThresholds(data);
        } catch (err) {
            console.error(err);
            setError("Không thể tải cấu hình ngưỡng.");
        } finally {
            setLoading(false);
        }
    };

    const fetchChannelDefinitions = async () => {
        try {
            setChannelsLoading(true);
            const data = await channelDefinitionService.getAll();
            setChannelDefinitions(data);
        } catch (err) {
            console.error(err);
        } finally {
            setChannelsLoading(false);
        }
    };

    // ── Derived data ─────────────────────────────────────────────────────────
    const filteredThresholds = useMemo(() => {
        if (filterType === "all") return thresholds;
        return thresholds.filter(
            (t) => t.channelDefinitionId === parseInt(filterType, 10),
        );
    }, [thresholds, filterType]);

    // ── Handlers ─────────────────────────────────────────────────────────────
    const handleDelete = async (id) => {
        if (!confirm("Xóa ngưỡng này?")) return;
        try {
            await thresholdService.delete(id);
            fetchThresholds();
        } catch (err) {
            console.error(err);
            alert("Xóa thất bại. Vui lòng thử lại.");
        }
    };

    const handleSave = async (form) => {
        try {
            setSubmitting(true);
            if (editing) await thresholdService.update(editing.id, form);
            else await thresholdService.create(form);
            setModalOpen(false);
            setEditing(null);
            fetchThresholds();
        } catch (err) {
            console.error(err);
            alert(err?.response?.data || "Lưu thất bại. Vui lòng thử lại.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteChannel = async (id) => {
        if (!confirm("Xóa channel này?")) return;
        try {
            await channelDefinitionService.delete(id);
            fetchChannelDefinitions();
        } catch (err) {
            console.error(err);
            alert("Xóa thất bại. Vui lòng thử lại.");
        }
    };

    const handleSaveChannel = async (form) => {
        try {
            setTypeSubmitting(true);
            if (editingType)
                await channelDefinitionService.update(editingType.id, form);
            else await channelDefinitionService.create(form);
            setTypeModalOpen(false);
            setEditingType(null);
            fetchChannelDefinitions();
        } catch (err) {
            console.error(err);
            alert(err?.response?.data || "Lưu thất bại. Vui lòng thử lại.");
        } finally {
            setTypeSubmitting(false);
        }
    };

    // ── Column definitions ────────────────────────────────────────────────────
    const thresholdColumns = [
        {
            key: "channelName",
            label: "Kênh",
            className: "font-semibold text-on-surface",
        },
        {
            key: "dataKey",
            label: "Khóa dữ liệu",
            render: (value) => (
                <span className="font-mono text-[12px] text-on-surface-variant bg-surface-container px-2 py-0.5 rounded-md">
                    {value}
                </span>
            ),
        },
        {
            key: "thresholdValue",
            label: "Ngưỡng",
            className: "tabular-nums text-on-surface",
        },
        {
            key: "level",
            label: "Mức",
            render: (value) => <LevelBadge value={value} />,
        },
        {
            key: "unitSymbol",
            label: "Đơn vị",
            className: "font-semibold text-on-surface-variant",
        },
        {
            key: "note",
            label: "Ghi chú",
            className: "text-on-surface-variant max-w-xs truncate",
            render: (value) => value || <span className="opacity-40">—</span>,
        },
        {
            key: "_actions",
            label: "",
            align: "right",
            render: (_, row) => (
                <RowActions
                    onEdit={() => {
                        setEditing(row);
                        setModalOpen(true);
                    }}
                    onDelete={() => handleDelete(row.id)}
                />
            ),
        },
    ];

    const channelColumns = [
        {
            key: "name",
            label: "Tên",
            className: "font-semibold text-on-surface",
        },
        {
            key: "dataKey",
            label: "Khóa dữ liệu",
            render: (value) => (
                <span className="font-mono text-[12px] text-on-surface-variant bg-surface-container px-2 py-0.5 rounded-md">
                    {value}
                </span>
            ),
        },
        {
            key: "unitSymbol",
            label: "Đơn vị",
            className: "font-semibold text-on-surface-variant",
        },
        {
            key: "_actions",
            label: "",
            align: "right",
            render: (_, row) => (
                <RowActions
                    onEdit={() => {
                        setEditingType(row);
                        setTypeModalOpen(true);
                    }}
                    onDelete={() => handleDeleteChannel(row.id)}
                />
            ),
        },
    ];

    // ── Loading / error states ───────────────────────────────────────────────
    if (error) {
        return (
            <main className="ml-64 p-10 bg-surface min-h-[calc(100vh-64px)] flex items-center justify-center">
                <div className="flex flex-col items-center gap-2 text-center">
                    <span className="material-symbols-outlined text-4xl text-rose-400">
                        error
                    </span>
                    <p className="text-on-surface-variant">{error}</p>
                </div>
            </main>
        );
    }

    // ── Render ───────────────────────────────────────────────────────────────
    return (
        <main className="ml-64 bg-surface min-h-[calc(100vh-64px)]">
            {/* Header */}
            <div className="px-10 pt-10 pb-6 border-b border-outline-variant/15 bg-surface-container-low/40">
                <div className="flex flex-wrap items-start justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-2.5 mb-1">
                            <span className="material-symbols-outlined text-primary text-[22px]">
                                tune
                            </span>
                            <h2 className="text-2xl font-bold tracking-tight text-on-surface">
                                Cấu hình ngưỡng
                            </h2>
                        </div>
                        <p className="text-sm text-on-surface-variant ml-9">
                            Quản lý ngưỡng theo Kênh, Khóa dữ liệu và đơn vị
                            đo{" "}
                        </p>
                    </div>

                    {tab === "thresholds" ? (
                        <button
                            onClick={() => {
                                setEditing(null);
                                setModalOpen(true);
                            }}
                            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-sm font-semibold shadow-sm hover:bg-primary/90 active:scale-[.98] transition"
                        >
                            <span className="material-symbols-outlined text-[18px]">
                                add
                            </span>
                            Thêm ngưỡng
                        </button>
                    ) : (
                        <button
                            onClick={() => {
                                setEditingType(null);
                                setTypeModalOpen(true);
                            }}
                            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-sm font-semibold shadow-sm hover:bg-primary/90 active:scale-[.98] transition"
                        >
                            <span className="material-symbols-outlined text-[18px]">
                                add
                            </span>
                            Thêm kênh
                        </button>
                    )}
                </div>
            </div>

            {/* Tabs */}
            <div className="px-10">
                <div className="flex gap-1 border-b border-outline-variant/15">
                    <Tab
                        active={tab === "thresholds"}
                        icon="waterfall_chart"
                        label="Thresholds"
                        onClick={() => setTab("thresholds")}
                    />
                    <Tab
                        active={tab === "channels"}
                        icon="sensors"
                        label="Channels"
                        onClick={() => setTab("channels")}
                    />
                </div>
            </div>

            {/* Content */}
            <div className="px-10 py-6">
                {tab === "thresholds" && (
                    <>
                        {/* Filter */}
                        <div className="flex items-center gap-3 mb-5">
                            <span className="material-symbols-outlined text-[18px] text-on-surface-variant">
                                filter_list
                            </span>
                            <select
                                value={filterType}
                                onChange={(e) => setFilterType(e.target.value)}
                                className="px-3 py-1.5 rounded-lg border border-outline-variant/50 bg-white text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/30 cursor-pointer"
                            >
                                <option value="all">Tất cả kênh</option>
                                {channelDefinitions.map((t) => (
                                    <option key={t.id} value={t.id}>
                                        {t.name}
                                    </option>
                                ))}
                            </select>
                            {filterType !== "all" && (
                                <button
                                    onClick={() => setFilterType("all")}
                                    className="text-xs text-on-surface-variant hover:text-on-surface underline underline-offset-2"
                                >
                                    Xóa bộ lọc
                                </button>
                            )}
                            <span className="ml-auto text-xs text-on-surface-variant">
                                {filteredThresholds.length} ngưỡng
                            </span>
                        </div>

                        {/* Table */}
                        <DataTable
                            columns={thresholdColumns}
                            data={filteredThresholds}
                            rowKey="id"
                            loading={loading}
                            emptyIcon="waterfall_chart"
                            emptyText="Chưa có ngưỡng nào."
                            rowClassName="group"
                        />
                    </>
                )}

                {tab === "channels" && (
                    <DataTable
                        columns={channelColumns}
                        data={channelDefinitions}
                        rowKey="id"
                        loading={channelsLoading}
                        emptyIcon="sensors"
                        emptyText="Chưa có kênh nào."
                        rowClassName="group"
                    />
                )}
            </div>

            {/* Modals */}
            {modalOpen && (
                <ThresholdModal
                    editing={editing}
                    channelDefinitions={channelDefinitions}
                    levels={LEVELS}
                    onClose={() => {
                        setModalOpen(false);
                        setEditing(null);
                    }}
                    onSave={handleSave}
                    submitting={submitting}
                />
            )}
            {typeModalOpen && (
                <SensorTypeModal
                    editing={editingType}
                    onClose={() => {
                        setTypeModalOpen(false);
                        setEditingType(null);
                    }}
                    onSave={handleSaveChannel}
                    submitting={typeSubmitting}
                />
            )}
        </main>
    );
}
