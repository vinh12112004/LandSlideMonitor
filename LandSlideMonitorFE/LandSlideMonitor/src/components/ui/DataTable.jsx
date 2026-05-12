/**
 * DataTable — component bảng dùng chung cho toàn bộ ứng dụng.
 *
 * Props:
 *  columns: Array<{
 *    key: string,
 *    label: string,
 *    align?: "left" | "center" | "right",   // default: "left"
 *    className?: string,                     // class cho <td>
 *    render?: (value, row) => ReactNode,     // custom cell render
 *  }>
 *  data: Array<object>                       // mỗi object là một hàng
 *  rowKey: string | (row) => string          // key duy nhất cho mỗi hàng
 *  loading?: boolean
 *  emptyIcon?: string                        // tên Material Symbol
 *  emptyText?: string
 *  onRowClick?: (row) => void
 *  rowClassName?: string | (row) => string   // class tuỳ chỉnh theo từng hàng
 *  className?: string                        // class cho wrapper ngoài
 */

export default function DataTable({
    columns = [],
    data = [],
    rowKey = "id",
    loading = false,
    emptyIcon = "table_rows",
    emptyText = "Không có dữ liệu.",
    onRowClick,
    rowClassName,
    className = "",
}) {
    const getKey = (row) =>
        typeof rowKey === "function" ? rowKey(row) : row[rowKey];

    const getAlign = (col) => {
        switch (col.align) {
            case "center":
                return "text-center";
            case "right":
                return "text-right";
            default:
                return "text-left";
        }
    };

    const getRowClass = (row) => {
        const base =
            "border-b border-outline-variant/15 last:border-b-0 transition-colors";
        const hover = onRowClick
            ? "hover:bg-surface-container-low/50 cursor-pointer"
            : "hover:bg-surface-container-lowest/60";
        const custom =
            typeof rowClassName === "function"
                ? rowClassName(row)
                : (rowClassName ?? "");
        return `${base} ${hover} ${custom}`;
    };

    return (
        <div
            className={`bg-surface-container-lowest rounded-3xl overflow-hidden shadow-sm border border-outline-variant/10 ${className}`}
        >
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    {/* ── Header ── */}
                    <thead>
                        <tr className="border-b border-outline-variant/20 bg-surface-container-low/50">
                            {columns.map((col) => (
                                <th
                                    key={col.key}
                                    className={`px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant whitespace-nowrap ${getAlign(col)} ${col.headerClassName ?? ""}`}
                                >
                                    {col.label}
                                </th>
                            ))}
                        </tr>
                    </thead>

                    {/* ── Body ── */}
                    <tbody>
                        {loading ? (
                            <tr>
                                <td
                                    colSpan={columns.length}
                                    className="px-6 py-16 text-center"
                                >
                                    <div className="flex flex-col items-center gap-3 text-on-surface-variant">
                                        <span className="material-symbols-outlined text-4xl text-primary animate-spin">
                                            progress_activity
                                        </span>
                                        <p className="text-sm">Đang tải...</p>
                                    </div>
                                </td>
                            </tr>
                        ) : data.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={columns.length}
                                    className="px-6 py-16 text-center"
                                >
                                    <div className="flex flex-col items-center gap-3 text-on-surface-variant">
                                        <span className="material-symbols-outlined text-5xl opacity-25">
                                            {emptyIcon}
                                        </span>
                                        <p className="text-sm">{emptyText}</p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            data.map((row) => (
                                <tr
                                    key={getKey(row)}
                                    className={getRowClass(row)}
                                    onClick={
                                        onRowClick
                                            ? () => onRowClick(row)
                                            : undefined
                                    }
                                >
                                    {columns.map((col) => (
                                        <td
                                            key={col.key}
                                            className={`px-6 py-4 text-sm ${getAlign(col)} ${col.className ?? ""}`}
                                        >
                                            {col.render
                                                ? col.render(row[col.key], row)
                                                : (row[col.key] ?? "—")}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
