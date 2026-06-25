import { useMemo, useState } from "react";
import SensorTypeModal from "../components/thresholds/SensorTypeModal";
import ThresholdModal from "../components/thresholds/ThresholdModal";
import Button from "../components/ui/Button";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import DataTable from "../components/ui/DataTable";
import EmptyState from "../components/ui/EmptyState";
import LoadingState from "../components/ui/LoadingState";
import Select from "../components/ui/Select";
import { TabButton, Tabs } from "../components/ui/Tabs";
import { useThresholds } from "../features/thresholds/useThresholds";

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
        color: "text-red-700 bg-red-50 ring-red-200",
    },
];

function LevelBadge({ value }) {
    const type = LEVELS.find((item) => item.value === value);
    if (!type) return null;

    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${type.color}`}
        >
            <span
                className="h-1.5 w-1.5 rounded-full bg-current opacity-70"
                aria-hidden="true"
            />
            {type.label}
        </span>
    );
}

function RowActions({ onEdit, onDelete }) {
    return (
        <div className="flex items-center justify-end gap-1">
            <Button
                variant="ghost"
                size="icon"
                onClick={(event) => {
                    event.stopPropagation();
                    onEdit();
                }}
                aria-label="Chỉnh sửa"
            >
                <span className="material-symbols-outlined text-[18px]">
                    edit
                </span>
            </Button>
            <Button
                variant="ghost"
                size="icon"
                onClick={(event) => {
                    event.stopPropagation();
                    onDelete();
                }}
                className="text-error hover:text-error"
                aria-label="Xóa"
            >
                <span className="material-symbols-outlined text-[18px]">
                    delete
                </span>
            </Button>
        </div>
    );
}

export default function ThresholdsPage() {
    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [typeModalOpen, setTypeModalOpen] = useState(false);
    const [editingType, setEditingType] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const {
        filteredThresholds,
        channelDefinitions,
        loading,
        channelsLoading,
        error,
        mutationError,
        setMutationError,
        tab,
        setTab,
        filterType,
        setFilterType,
        submitting,
        typeSubmitting,
        deletingId,
        saveThreshold,
        deleteThreshold,
        saveChannel,
        deleteChannel,
        refetch,
    } = useThresholds();

    const closeThresholdModal = () => {
        setModalOpen(false);
        setEditing(null);
    };

    const closeChannelModal = () => {
        setTypeModalOpen(false);
        setEditingType(null);
    };

    const handleSaveThreshold = async (form) => {
        const saved = await saveThreshold(form, editing);
        if (saved) closeThresholdModal();
    };

    const handleSaveChannel = async (form) => {
        const saved = await saveChannel(form, editingType);
        if (saved) closeChannelModal();
    };

    const handleConfirmDelete = async () => {
        if (!deleteTarget) return;
        const deleted =
            deleteTarget.kind === "threshold"
                ? await deleteThreshold(deleteTarget.id)
                : await deleteChannel(deleteTarget.id);
        if (deleted) setDeleteTarget(null);
    };

    const thresholdColumns = useMemo(
        () => [
            {
                key: "id",
                label: "ID",
                className: "w-16 font-mono text-xs text-on-surface-variant",
            },
            {
                key: "channelName",
                label: "Kênh",
                className: "font-semibold text-on-surface",
            },
            {
                key: "dataKey",
                label: "Khóa dữ liệu",
                render: (value) => (
                    <span className="rounded-md bg-surface-container px-2 py-1 font-mono text-xs text-on-surface-variant">
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
                className: "max-w-xs truncate text-on-surface-variant",
                render: (value) =>
                    value || (
                        <span className="text-on-surface-variant/45">—</span>
                    ),
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
                            setMutationError(null);
                        }}
                        onDelete={() =>
                            setDeleteTarget({
                                kind: "threshold",
                                id: row.id,
                                label: row.channelName,
                            })
                        }
                    />
                ),
            },
        ],
        [setMutationError],
    );

    const channelColumns = useMemo(
        () => [
            {
                key: "id",
                label: "ID",
                className: "w-16 font-mono text-xs text-on-surface-variant",
            },
            {
                key: "name",
                label: "Tên",
                className: "font-semibold text-on-surface",
            },
            {
                key: "dataKey",
                label: "Khóa dữ liệu",
                render: (value) => (
                    <span className="rounded-md bg-surface-container px-2 py-1 font-mono text-xs text-on-surface-variant">
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
                            setMutationError(null);
                        }}
                        onDelete={() =>
                            setDeleteTarget({
                                kind: "channel",
                                id: row.id,
                                label: row.name,
                            })
                        }
                    />
                ),
            },
        ],
        [setMutationError],
    );

    if (loading && filteredThresholds.length === 0 && !error) {
        return (
            <section className="page-shell">
                <LoadingState message="Đang tải cấu hình ngưỡng..." />
            </section>
        );
    }

    if (error) {
        return (
            <section className="page-shell">
                <EmptyState
                    icon="error_outline"
                    title="Không thể tải cấu hình"
                    description={error}
                    actionLabel="Thử lại"
                    onAction={refetch}
                />
            </section>
        );
    }

    return (
        <section className="page-shell">
            <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div>
                    <p className="mb-2 text-xs font-bold uppercase tracking-widest text-primary">
                        Threshold Rules
                    </p>
                    <h1 className="text-3xl font-extrabold tracking-tight text-on-surface md:text-4xl">
                        Cấu hình ngưỡng
                    </h1>
                    <p className="mt-2 max-w-2xl text-sm text-on-surface-variant">
                        Quản lý ngưỡng theo kênh, khóa dữ liệu và đơn vị đo.
                    </p>
                </div>
                <Button
                    onClick={() => {
                        if (tab === "thresholds") {
                            setEditing(null);
                            setModalOpen(true);
                        } else {
                            setEditingType(null);
                            setTypeModalOpen(true);
                        }
                        setMutationError(null);
                    }}
                    className="md:self-center"
                >
                    <span className="material-symbols-outlined" aria-hidden="true">
                        add
                    </span>
                    {tab === "thresholds" ? "Thêm ngưỡng" : "Thêm kênh"}
                </Button>
            </div>

            {mutationError && (
                <div
                    className="mb-5 rounded-lg border border-error/20 bg-error-container/25 px-4 py-3 text-sm font-medium text-on-error-container"
                    role="alert"
                >
                    {mutationError}
                </div>
            )}

            <Tabs label="Cấu hình ngưỡng" className="mb-6">
                <TabButton
                    active={tab === "thresholds"}
                    icon="waterfall_chart"
                    onClick={() => setTab("thresholds")}
                >
                    Thresholds
                </TabButton>
                <TabButton
                    active={tab === "channels"}
                    icon="sensors"
                    onClick={() => setTab("channels")}
                >
                    Channels
                </TabButton>
            </Tabs>

            {tab === "thresholds" && (
                <div className="space-y-4">
                    <div className="flex flex-col gap-3 rounded-lg border border-outline-variant/30 bg-surface-container-lowest p-4 shadow-sm sm:flex-row sm:items-end">
                        <Select
                            label="Lọc theo kênh"
                            value={filterType}
                            onChange={(event) =>
                                setFilterType(event.target.value)
                            }
                            containerClassName="sm:w-72"
                        >
                            <option value="all">Tất cả kênh</option>
                            {channelDefinitions.map((definition) => (
                                <option
                                    key={definition.id}
                                    value={definition.id}
                                >
                                    {definition.name}
                                </option>
                            ))}
                        </Select>
                        <p className="text-sm text-on-surface-variant sm:ml-auto">
                            {filteredThresholds.length} ngưỡng
                        </p>
                    </div>
                    <DataTable
                        columns={thresholdColumns}
                        data={filteredThresholds}
                        rowKey="id"
                        loading={loading}
                        emptyIcon="waterfall_chart"
                        emptyTitle="Chưa có ngưỡng"
                        emptyText="Chưa có ngưỡng nào."
                    />
                </div>
            )}

            {tab === "channels" && (
                <DataTable
                    columns={channelColumns}
                    data={channelDefinitions}
                    rowKey="id"
                    loading={channelsLoading}
                    emptyIcon="sensors"
                    emptyTitle="Chưa có kênh"
                    emptyText="Chưa có kênh nào."
                />
            )}

            {modalOpen && (
                <ThresholdModal
                    editing={editing}
                    channelDefinitions={channelDefinitions}
                    levels={LEVELS}
                    onClose={closeThresholdModal}
                    onSave={handleSaveThreshold}
                    submitting={submitting}
                />
            )}
            {typeModalOpen && (
                <SensorTypeModal
                    editing={editingType}
                    onClose={closeChannelModal}
                    onSave={handleSaveChannel}
                    submitting={typeSubmitting}
                />
            )}
            <ConfirmDialog
                open={Boolean(deleteTarget)}
                title={
                    deleteTarget?.kind === "threshold"
                        ? "Xóa ngưỡng?"
                        : "Xóa kênh?"
                }
                description={`Bạn có chắc muốn xóa ${deleteTarget?.label ?? "mục này"}?`}
                confirmLabel="Xóa"
                isLoading={Boolean(deletingId)}
                onClose={() => setDeleteTarget(null)}
                onConfirm={handleConfirmDelete}
            />
        </section>
    );
}
