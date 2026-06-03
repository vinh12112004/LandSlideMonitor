import AlertsTable from "../components/alerts/AlertsTable";
import Pagination from "../components/common/Pagination";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import EmptyState from "../components/ui/EmptyState";
import Input from "../components/ui/Input";
import LoadingState from "../components/ui/LoadingState";
import { ALERTS_LIMIT, useAlerts } from "../features/alerts/useAlerts";

function StatCard({ icon, label, value, tone = "primary" }) {
    const toneClass = {
        primary: "bg-primary-container/25 text-primary",
        warning: "bg-amber-50 text-amber-700",
        danger: "bg-red-50 text-red-700",
    }[tone];

    return (
        <Card className="px-5 py-4">
            <div className="flex items-center gap-4">
                <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${toneClass}`}
                >
                    <span
                        className="material-symbols-outlined text-[22px]"
                        aria-hidden="true"
                    >
                        {icon}
                    </span>
                </div>
                <div>
                    <p className="text-2xl font-extrabold leading-none tabular-nums text-on-surface">
                        {value ?? "—"}
                    </p>
                    <p className="mt-1 text-xs text-on-surface-variant">
                        {label}
                    </p>
                </div>
            </div>
        </Card>
    );
}

export default function AlertsPage() {
    const {
        data,
        rows,
        filters,
        appliedFilters,
        loading,
        error,
        stats,
        setFilter,
        search,
        reset,
        setPage,
        refetch,
    } = useAlerts();

    const hasActiveFilters =
        appliedFilters.deviceId ||
        appliedFilters.dateFrom ||
        appliedFilters.dateTo;

    const handleKeyDown = (event) => {
        if (event.key === "Enter") search();
    };

    if (loading && !data) {
        return (
            <section className="page-shell">
                <LoadingState message="Đang tải cảnh báo..." />
            </section>
        );
    }

    if (error && !data) {
        return (
            <section className="page-shell">
                <EmptyState
                    icon="error_outline"
                    title="Không thể tải cảnh báo"
                    description={error}
                    actionLabel="Thử lại"
                    onAction={refetch}
                />
            </section>
        );
    }

    return (
        <section className="page-shell">
            <div className="mb-8">
                <p className="mb-2 text-xs font-bold uppercase tracking-widest text-error">
                    Alert Center
                </p>
                <h1 className="text-3xl font-extrabold tracking-tight text-on-surface md:text-4xl">
                    Cảnh báo
                </h1>
                <p className="mt-2 max-w-2xl text-sm text-on-surface-variant">
                    Danh sách các bản ghi dữ liệu cảm biến vượt ngưỡng an toàn.
                </p>
            </div>

            {error && (
                <div
                    className="mb-5 rounded-lg border border-error/20 bg-error-container/25 px-4 py-3 text-sm font-medium text-on-error-container"
                    role="alert"
                >
                    {error}
                </div>
            )}

            <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
                <StatCard icon="list_alt" label="Tổng bản ghi" value={stats.total} />
                <StatCard
                    icon="warning"
                    label="Cảnh báo (trang này)"
                    value={stats.warning}
                    tone="warning"
                />
                <StatCard
                    icon="crisis_alert"
                    label="Báo động (trang này)"
                    value={stats.alert}
                    tone="danger"
                />
            </div>

            <Card className="mb-6 px-5 py-4">
                <p className="mb-3 text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                    Bộ lọc
                </p>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-[minmax(0,1fr)_auto_auto] lg:grid-cols-[220px_220px_220px_auto_auto]">
                    <Input
                        label="Thiết bị"
                        value={filters.deviceId}
                        onChange={(event) =>
                            setFilter("deviceId", event.target.value)
                        }
                        onKeyDown={handleKeyDown}
                        placeholder="VD: ESP32_HN_01"
                        icon="memory"
                    />
                    <Input
                        label="Từ ngày"
                        type="datetime-local"
                        value={filters.dateFrom}
                        onChange={(event) =>
                            setFilter("dateFrom", event.target.value)
                        }
                    />
                    <Input
                        label="Đến ngày"
                        type="datetime-local"
                        value={filters.dateTo}
                        onChange={(event) =>
                            setFilter("dateTo", event.target.value)
                        }
                    />
                    <div className="flex items-end">
                        <Button onClick={search} className="w-full">
                            <span
                                className="material-symbols-outlined text-[18px]"
                                aria-hidden="true"
                            >
                                search
                            </span>
                            Tìm kiếm
                        </Button>
                    </div>
                    {hasActiveFilters && (
                        <div className="flex items-end">
                            <Button
                                variant="outline"
                                onClick={reset}
                                className="w-full"
                            >
                                <span
                                    className="material-symbols-outlined text-[18px]"
                                    aria-hidden="true"
                                >
                                    close
                                </span>
                                Xóa lọc
                            </Button>
                        </div>
                    )}
                </div>
            </Card>

            <AlertsTable
                alerts={rows}
                loading={loading}
                indexOffset={(appliedFilters.page - 1) * ALERTS_LIMIT}
            />
            {data && (
                <Pagination
                    currentPage={data.currentPage}
                    totalPages={data.totalPages}
                    onPageChange={setPage}
                    pageSize={ALERTS_LIMIT}
                    total={data.totalCount}
                />
            )}
        </section>
    );
}
