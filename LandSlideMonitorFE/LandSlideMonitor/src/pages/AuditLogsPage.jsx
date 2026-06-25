import AuditLogTable from "../components/audit-logs/AuditLogTable";
import Pagination from "../components/common/Pagination";
import EmptyState from "../components/ui/EmptyState";
import LoadingState from "../components/ui/LoadingState";
import { useAuditLogs } from "../features/audit-logs/useAuditLogs";

export default function AuditLogsPage() {
    const {
        rows,
        loading,
        error,
        pagination,
        isPaged,
        setPage,
        refetch,
    } = useAuditLogs();

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
