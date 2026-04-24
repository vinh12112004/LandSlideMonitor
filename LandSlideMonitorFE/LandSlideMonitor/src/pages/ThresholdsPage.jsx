import { useEffect, useMemo, useState } from "react";
import thresholdService from "../services/thresholdService";
import channelDefinitionService from "../services/channelDefinitionService";
import ThresholdModal from "../components/thresholds/ThresholdModal";
import SensorTypeModal from "../components/thresholds/SensorTypeModal";

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

function IconButton({ onClick, title, icon, variant = "default" }) {
    const colors =
        variant === "danger"
            ? "text-rose-500 hover:text-rose-700 hover:bg-rose-50"
            : "text-blue-500 hover:text-blue-700 hover:bg-blue-50";
    return (
        <button
            onClick={onClick}
            title={title}
            className={`p-1.5 rounded-lg transition-colors ${colors}`}
        >
            <span className="material-symbols-outlined text-[18px] leading-none">
                {icon}
            </span>
        </button>
    );
}

export default function ThresholdsPage() {
    const [thresholds, setThresholds] = useState([]);
    const [channelDefinitions, setChannelDefinitions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [tab, setTab] = useState("thresholds");
    const [filterType, setFilterType] = useState("all");
    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [typeModalOpen, setTypeModalOpen] = useState(false);
    const [editingType, setEditingType] = useState(null);
    const [typeSubmitting, setTypeSubmitting] = useState(false);

    useEffect(() => {
        fetchThresholds();
        fetchChannelDefinitions();
    }, []);

    const fetchChannelDefinitions = async () => {
        try {
            const data = await channelDefinitionService.getAll();
            setChannelDefinitions(data);
        } catch (err) {
            console.error(err);
        }
    };

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

    const filtered = useMemo(() => {
        if (filterType === "all") return thresholds;
        return thresholds.filter(
            (t) => t.channelDefinitionId === parseInt(filterType, 10),
        );
    }, [thresholds, filterType]);

    const handleOpenAdd = () => {
        setEditing(null);
        setModalOpen(true);
    };
    const handleOpenEdit = (t) => {
        setEditing(t);
        setModalOpen(true);
    };
    const handleCloseModal = () => {
        setModalOpen(false);
        setEditing(null);
    };

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
            handleCloseModal();
            fetchThresholds();
        } catch (err) {
            console.error(err);
            alert(err?.response?.data || "Lưu thất bại. Vui lòng thử lại.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleSaveType = async (form) => {
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

    const handleDeleteType = async (id) => {
        if (!confirm("Xóa ChannelDefinition này?")) return;
        try {
            await channelDefinitionService.delete(id);
            fetchChannelDefinitions();
        } catch (err) {
            console.error(err);
            alert("Xóa thất bại. Vui lòng thử lại.");
        }
    };

    if (loading) {
        return (
            <main className="ml-64 p-10 bg-surface min-h-[calc(100vh-64px)] flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <span className="material-symbols-outlined text-4xl text-primary animate-spin">
                        progress_activity
                    </span>
                    <p className="text-sm text-on-surface-variant">
                        Đang tải dữ liệu…
                    </p>
                </div>
            </main>
        );
    }

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

    return (
        <main className="ml-64 bg-surface min-h-[calc(100vh-64px)]">
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
                            Quản lý ngưỡng theo Channel, DataKey và đơn vị đo
                        </p>
                    </div>

                    {tab === "thresholds" ? (
                        <button
                            onClick={handleOpenAdd}
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
                            Thêm Channel
                        </button>
                    )}
                </div>
            </div>

            <div className="px-10">
                <div className="flex gap-1 border-b border-outline-variant/15">
                    {[
                        {
                            key: "thresholds",
                            label: "Thresholds",
                            icon: "waterfall_chart",
                        },
                        {
                            key: "channels",
                            label: "Channels",
                            icon: "sensors",
                        },
                    ].map((t) => (
                        <button
                            key={t.key}
                            onClick={() => setTab(t.key)}
                            className={`flex items-center gap-1.5 px-4 py-3 text-sm font-semibold border-b-2 -mb-px transition ${
                                tab === t.key
                                    ? "border-primary text-primary"
                                    : "border-transparent text-on-surface-variant hover:text-on-surface"
                            }`}
                        >
                            <span className="material-symbols-outlined text-[16px]">
                                {t.icon}
                            </span>
                            {t.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="px-10 py-6">
                {tab === "thresholds" && (
                    <>
                        <div className="flex items-center gap-3 mb-5">
                            <span className="material-symbols-outlined text-[18px] text-on-surface-variant">
                                filter_list
                            </span>
                            <select
                                value={filterType}
                                onChange={(e) => setFilterType(e.target.value)}
                                className="px-3 py-1.5 rounded-lg border border-outline-variant/50 bg-white text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/30 cursor-pointer"
                            >
                                <option value="all">Tất cả Channel</option>
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
                        </div>

                        <div className="bg-white rounded-2xl border border-outline-variant/15 overflow-hidden shadow-[0_1px_4px_rgba(0,0,0,.06)]">
                            <div className="grid grid-cols-[1.3fr_1fr_120px_110px_90px_1fr_90px] gap-4 px-5 py-3 bg-surface-container-low/60 border-b border-outline-variant/10">
                                {[
                                    "Channel",
                                    "DataKey",
                                    "Threshold",
                                    "Level",
                                    "Unit",
                                    "Note",
                                    "",
                                ].map((h) => (
                                    <div
                                        key={h}
                                        className="text-[11px] font-bold text-on-surface-variant uppercase tracking-widest last:text-right"
                                    >
                                        {h}
                                    </div>
                                ))}
                            </div>

                            {filtered.length === 0 ? (
                                <div className="flex flex-col items-center gap-2 py-16 text-on-surface-variant">
                                    <span className="material-symbols-outlined text-4xl opacity-30">
                                        data_table
                                    </span>
                                    <p className="text-sm">
                                        Chưa có ngưỡng nào.
                                    </p>
                                </div>
                            ) : (
                                filtered.map((t) => (
                                    <div
                                        key={t.id}
                                        className="grid grid-cols-[1.3fr_1fr_120px_110px_90px_1fr_90px] gap-4 px-5 py-3.5 text-sm text-on-surface border-b border-outline-variant/10 last:border-b-0 hover:bg-surface-container-lowest/60 transition group"
                                    >
                                        <div className="font-semibold truncate">
                                            {t.channelName}
                                        </div>
                                        <div className="font-mono text-[12px] text-on-surface-variant bg-surface-container px-2 py-0.5 rounded-md self-center w-fit max-w-full truncate">
                                            {t.dataKey}
                                        </div>
                                        <div className="tabular-nums">
                                            {t.thresholdValue}
                                        </div>
                                        <div>
                                            <LevelBadge value={t.level} />
                                        </div>
                                        <div className="font-semibold text-on-surface-variant self-center">
                                            {t.unitSymbol}
                                        </div>
                                        <div className="text-on-surface-variant truncate">
                                            {t.note || "-"}
                                        </div>
                                        <div className="flex justify-end gap-0.5 opacity-0 group-hover:opacity-100 transition">
                                            <IconButton
                                                onClick={() =>
                                                    handleOpenEdit(t)
                                                }
                                                title="Chỉnh sửa"
                                                icon="edit"
                                            />
                                            <IconButton
                                                onClick={() =>
                                                    handleDelete(t.id)
                                                }
                                                title="Xóa"
                                                icon="delete"
                                                variant="danger"
                                            />
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {filtered.length > 0 && (
                            <p className="mt-3 text-xs text-on-surface-variant text-right">
                                {filtered.length} ngưỡng
                            </p>
                        )}

                        {modalOpen && (
                            <ThresholdModal
                                editing={editing}
                                channelDefinitions={channelDefinitions}
                                levels={LEVELS}
                                onClose={handleCloseModal}
                                onSave={handleSave}
                                submitting={submitting}
                            />
                        )}
                    </>
                )}

                {tab === "channels" && (
                    <div className="bg-white rounded-2xl border border-outline-variant/15 overflow-hidden shadow-[0_1px_4px_rgba(0,0,0,.06)]">
                        <div className="grid grid-cols-[1.5fr_1fr_100px_100px] gap-4 px-5 py-3 bg-surface-container-low/60 border-b border-outline-variant/10">
                            {["Name", "DataKey", "Unit", ""].map((h) => (
                                <div
                                    key={h}
                                    className="text-[11px] font-bold text-on-surface-variant uppercase tracking-widest last:text-right"
                                >
                                    {h}
                                </div>
                            ))}
                        </div>

                        {channelDefinitions.length === 0 ? (
                            <div className="flex flex-col items-center gap-2 py-16 text-on-surface-variant">
                                <span className="material-symbols-outlined text-4xl opacity-30">
                                    sensors
                                </span>
                                <p className="text-sm">Chưa có channel nào.</p>
                            </div>
                        ) : (
                            channelDefinitions.map((t) => (
                                <div
                                    key={t.id}
                                    className="grid grid-cols-[1.5fr_1fr_100px_100px] gap-4 px-5 py-3.5 text-sm text-on-surface border-b border-outline-variant/10 last:border-b-0 hover:bg-surface-container-lowest/60 transition group"
                                >
                                    <div className="flex items-center gap-2.5 font-semibold">
                                        {t.name}
                                    </div>
                                    <div className="font-mono text-[12px] text-on-surface-variant bg-surface-container px-2 py-0.5 rounded-md self-center w-fit truncate">
                                        {t.dataKey}
                                    </div>
                                    <div className="font-semibold text-on-surface-variant self-center">
                                        {t.unitSymbol}
                                    </div>
                                    <div className="flex justify-end gap-0.5 opacity-0 group-hover:opacity-100 transition">
                                        <IconButton
                                            onClick={() => {
                                                setEditingType(t);
                                                setTypeModalOpen(true);
                                            }}
                                            title="Chỉnh sửa"
                                            icon="edit"
                                        />
                                        <IconButton
                                            onClick={() =>
                                                handleDeleteType(t.id)
                                            }
                                            title="Xóa"
                                            icon="delete"
                                            variant="danger"
                                        />
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>

            {typeModalOpen && (
                <SensorTypeModal
                    editing={editingType}
                    onClose={() => {
                        setTypeModalOpen(false);
                        setEditingType(null);
                    }}
                    onSave={handleSaveType}
                    submitting={typeSubmitting}
                />
            )}
        </main>
    );
}
