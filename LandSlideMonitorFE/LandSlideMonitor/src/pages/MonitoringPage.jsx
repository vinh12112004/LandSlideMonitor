import { useMemo } from "react";
import DataStatusBadge from "../components/alerts/DataStatusBadge";
import Card from "../components/ui/Card";
import DataTable from "../components/ui/DataTable";
import EmptyState from "../components/ui/EmptyState";
import LoadingState from "../components/ui/LoadingState";
import { useDashboardSummary } from "../features/dashboard/useDashboardSummary";
import { resolveDataStatus } from "../utils/dataStatus";
import { formatDateTime } from "../utils/time";

const STAT_CARDS = [
    {
        key: "totalDevices",
        label: "Tổng thiết bị",
        icon: "devices",
        tone: "primary",
    },
    { key: "onlineDevices", label: "Online", icon: "wifi", tone: "success" },
    {
        key: "offlineDevices",
        label: "Offline",
        icon: "wifi_off",
        tone: "neutral",
    },
    {
        key: "maintenanceDevices",
        label: "Bảo trì",
        icon: "build",
        tone: "warning",
    },
    {
        key: "normalDevices",
        label: "Bình thường",
        icon: "check_circle",
        tone: "success",
    },
    {
        key: "warningDevices",
        label: "Cảnh báo",
        icon: "warning",
        tone: "warning",
    },
    {
        key: "alertDevices",
        label: "Báo động",
        icon: "crisis_alert",
        tone: "danger",
    },
];

const TONE_CLASSES = {
    primary: "bg-primary-container/20 text-primary ring-primary/15",
    success: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    neutral:
        "bg-surface-container text-on-surface-variant ring-outline-variant/45",
    warning: "bg-amber-50 text-amber-700 ring-amber-200",
    danger: "bg-red-50 text-red-700 ring-red-200",
};

function formatStatValue(value) {
    return typeof value === "number"
        ? value.toLocaleString("vi-VN")
        : (value ?? "—");
}

function PageHeader({ scopeName }) {
    return (
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
                <p className="mb-2 text-xs font-bold uppercase tracking-widest text-primary">
                    Monitoring Center
                </p>
                <h1 className="text-3xl font-extrabold tracking-tight text-on-surface md:text-4xl">
                    Giám sát tổng quan
                </h1>
                <p className="mt-2 max-w-2xl text-sm text-on-surface-variant">
                    Theo dõi tình trạng thiết bị và cảnh báo theo phạm vi quyền
                    của bạn.
                </p>
            </div>
            {scopeName && (
                <div className="inline-flex w-fit items-center gap-2 rounded-full border border-outline-variant/45 bg-surface-container-lowest px-4 py-2 text-sm font-semibold text-on-surface shadow-sm">
                    <span
                        className="material-symbols-outlined text-[18px] text-primary"
                        aria-hidden="true"
                    >
                        travel_explore
                    </span>
                    Phạm vi: {scopeName}
                </div>
            )}
        </div>
    );
}

function StatCard({ icon, label, value, tone }) {
    return (
        <Card className="px-5 py-4">
            <div className="flex items-center gap-4">
                <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ring-1 ${TONE_CLASSES[tone]}`}
                >
                    <span
                        className="material-symbols-outlined text-[22px]"
                        aria-hidden="true"
                    >
                        {icon}
                    </span>
                </div>
                <div className="min-w-0">
                    <p className="text-2xl font-extrabold leading-none tabular-nums text-on-surface">
                        {formatStatValue(value)}
                    </p>
                    <p className="mt-1 text-xs text-on-surface-variant">
                        {label}
                    </p>
                </div>
            </div>
        </Card>
    );
}

export default function MonitoringPage() {
    const { summary, loading, error, refetch } = useDashboardSummary();
    const recentAlerts = summary?.recentAlerts || [];

    const alertColumns = useMemo(
        () => [
            {
                key: "timestamp",
                label: "Thời gian",
                render: (value) => (
                    <span className="whitespace-nowrap text-sm text-on-surface-variant">
                        {value ? formatDateTime(value) : "-"}
                    </span>
                ),
            },
            {
                key: "deviceName",
                label: "Thiết bị",
                render: (value, row) => (
                    <div className="min-w-0">
                        <p className="font-semibold text-on-surface">
                            {value || row.deviceId || "—"}
                        </p>
                        {row.deviceId && (
                            <p className="mt-0.5 font-mono text-xs text-on-surface-variant">
                                {row.deviceId}
                            </p>
                        )}
                    </div>
                ),
            },
            {
                key: "provinceName",
                label: "Tỉnh",
                render: (value) => value || "—",
            },
            {
                key: "status",
                label: "Mức",
                render: (value) => <DataStatusBadge status={value} />,
            },
            {
                key: "alertReason",
                label: "Lý do",
                render: (value) =>
                    value ? (
                        <span className="flex items-start gap-1.5 text-sm text-on-surface-variant">
                            <span
                                className="material-symbols-outlined mt-0.5 shrink-0 text-[15px] text-error"
                                aria-hidden="true"
                            >
                                error
                            </span>
                            {value}
                        </span>
                    ) : (
                        <span className="text-xs italic text-on-surface-variant/45">
                            —
                        </span>
                    ),
            },
        ],
        [],
    );

    const alertRowClassName = (row) => {
        const status = resolveDataStatus(row.status);
        if (status === 2) return "bg-error/[.03] hover:bg-error/[.06]";
        if (status === 1) return "bg-amber-500/[.03] hover:bg-amber-500/[.06]";
        return "";
    };

    if (loading && !summary) {
        return (
            <section className="page-shell">
                <PageHeader />
                <LoadingState message="Đang tải tổng quan giám sát..." />
            </section>
        );
    }

    if (error && !summary) {
        return (
            <section className="page-shell">
                <PageHeader />
                <EmptyState
                    icon="error_outline"
                    title="Không thể tải tổng quan"
                    description={error}
                    actionLabel="Thử lại"
                    onAction={refetch}
                />
            </section>
        );
    }

    return (
        <section className="page-shell">
            <PageHeader scopeName={summary?.scopeName} />

            {error && (
                <div
                    className="mb-5 rounded-lg border border-error/20 bg-error-container/25 px-4 py-3 text-sm font-medium text-on-error-container"
                    role="alert"
                >
                    {error}
                </div>
            )}

            <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-7">
                {STAT_CARDS.map((stat) => (
                    <StatCard
                        key={stat.key}
                        icon={stat.icon}
                        label={stat.label}
                        value={summary?.[stat.key]}
                        tone={stat.tone}
                    />
                ))}
            </div>

            <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                        Cảnh báo gần đây
                    </p>
                </div>
            </div>

            <DataTable
                columns={alertColumns}
                data={recentAlerts}
                rowKey={(row) => row.id ?? `${row.deviceId}-${row.timestamp}`}
                loading={loading}
                emptyIcon="check_circle"
                emptyTitle="Chưa có cảnh báo gần đây"
                emptyText="Hệ thống chưa ghi nhận cảnh báo trong phạm vi này."
                rowClassName={alertRowClassName}
            />
        </section>
    );
}
