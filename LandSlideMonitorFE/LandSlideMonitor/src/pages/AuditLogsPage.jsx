import AuditLogTable from "../components/audit-logs/AuditLogTable";
import Pagination from "../components/common/Pagination";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import EmptyState from "../components/ui/EmptyState";
import Input from "../components/ui/Input";
import LoadingState from "../components/ui/LoadingState";
import Select from "../components/ui/Select";
import { useAuditLogs } from "../features/audit-logs/useAuditLogs";

export default function AuditLogsPage() {
    const {
        rows,
        filters,
        appliedFilters,
        loading,
        error,
        pagination,
        isPaged,
        setFilter,
        search,
        reset,
        setPage,
        refetch,
    } = useAuditLogs();

    const hasActiveFilters =
        appliedFilters.actionType ||
        appliedFilters.dateFrom ||
        appliedFilters.dateTo ||
        appliedFilters.id ||
        appliedFilters.userId;

    const handleKeyDown = (event) => {
        if (event.key === "Enter") search();
    };

    if (loading && rows.length === 0) {
        return (
            <section className="page-shell">
                <LoadingState message="Đang tải nhật ký hệ thống..." />
            </section>
        );
    }

    if (error && rows.length === 0) {
        return (
            <section className="page-shell">
                <EmptyState
                    icon="error_outline"
                    title="Không thể tải nhật ký hệ thống"
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
                <p className="mb-2 text-xs font-bold uppercase tracking-widest text-primary">
                    Nhật ký hệ thống
                </p>
                <h1 className="text-3xl font-extrabold tracking-tight text-on-surface md:text-4xl">
                    Nhật ký hệ thống
                </h1>
                <p className="mt-2 max-w-2xl text-sm text-on-surface-variant">
                    Theo dõi các thao tác thay đổi dữ liệu trong hệ thống.
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

            <Card className="mb-6 px-5 py-4">
                <p className="mb-3 text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                    Bộ lọc
                </p>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-[170px_180px_180px_180px_180px_auto_auto]">
                    <Input
                        label="ID người dùng"
                        value={filters.userId}
                        onChange={(event) =>
                            setFilter("userId", event.target.value)
                        }
                        onKeyDown={handleKeyDown}
                        placeholder="VD: 1"
                        icon="person"
                    />
                    <Select
                        label="Hành động"
                        value={filters.actionType}
                        onChange={(event) =>
                            setFilter("actionType", event.target.value)
                        }
                    >
                        <option value="">Tất cả hành động</option>
                        <option value="CREATE">Tạo</option>
                        <option value="UPDATE">Cập nhật</option>
                        <option value="DELETE">Xóa</option>
                    </Select>
                    <Input
                        label="ID bản ghi"
                        value={filters.id}
                        onChange={(event) =>
                            setFilter("id", event.target.value)
                        }
                        onKeyDown={handleKeyDown}
                        placeholder="VD: 5"
                        icon="tag"
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

            <AuditLogTable logs={rows} loading={loading} />
            {isPaged && (
                <Pagination
                    currentPage={pagination.currentPage}
                    totalPages={pagination.totalPages}
                    total={pagination.totalCount}
                    pageSize={pagination.pageSize}
                    onPageChange={setPage}
                />
            )}
        </section>
    );
}
