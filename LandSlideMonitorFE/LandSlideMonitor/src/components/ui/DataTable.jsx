import { Fragment } from "react";
import EmptyState from "./EmptyState";
import LoadingState from "./LoadingState";
import { cn } from "../../utils/cn";

export default function DataTable({
    columns = [],
    data = [],
    rowKey = "id",
    loading = false,
    emptyIcon = "table_rows",
    emptyText = "Không có dữ liệu.",
    emptyTitle = "Không có dữ liệu",
    onRowClick,
    rowClassName,
    expandedRowRender,
    isRowExpanded,
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
            ? "cursor-pointer hover:bg-surface-container-low/55 focus-visible:bg-surface-container-low focus-visible:outline-none"
            : "hover:bg-surface-container-lowest/60";
        const custom =
            typeof rowClassName === "function"
                ? rowClassName(row)
                : (rowClassName ?? "");
        return cn(base, hover, custom);
    };

    const handleRowKeyDown = (event, row) => {
        if (!onRowClick) return;
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            onRowClick(row);
        }
    };

    return (
        <div
            className={cn(
                "overflow-hidden rounded-lg border border-outline-variant/25 bg-surface-container-lowest shadow-sm",
                className,
            )}
        >
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-outline-variant/25 bg-surface-container-low/65">
                            {columns.map((col) => (
                                <th
                                    key={col.key}
                                    scope="col"
                                    className={`px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant whitespace-nowrap ${getAlign(col)} ${col.headerClassName ?? ""}`}
                                >
                                    {col.label}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td
                                    colSpan={columns.length}
                                    className="px-6 py-8 text-center"
                                >
                                    <LoadingState
                                        message="Đang tải..."
                                        className="min-h-40"
                                    />
                                </td>
                            </tr>
                        ) : data.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={columns.length}
                                    className="px-6 py-8 text-center"
                                >
                                    <EmptyState
                                        icon={emptyIcon}
                                        title={emptyTitle}
                                        description={emptyText}
                                        className="min-h-40 border-0 bg-transparent"
                                    />
                                </td>
                            </tr>
                        ) : (
                            data.map((row, rowIndex) => (
                                <Fragment key={getKey(row)}>
                                    <tr
                                        className={getRowClass(row)}
                                        onClick={
                                            onRowClick
                                                ? () => onRowClick(row)
                                                : undefined
                                        }
                                        onKeyDown={(event) =>
                                            handleRowKeyDown(event, row)
                                        }
                                        tabIndex={onRowClick ? 0 : undefined}
                                    >
                                        {columns.map((col) => (
                                            <td
                                                key={col.key}
                                                className={`px-6 py-4 text-sm ${getAlign(col)} ${col.className ?? ""}`}
                                            >
                                                {col.render
                                                    ? col.render(
                                                          row[col.key],
                                                          row,
                                                          rowIndex,
                                                      )
                                                    : (row[col.key] ?? "—")}
                                            </td>
                                        ))}
                                    </tr>
                                    {expandedRowRender &&
                                        isRowExpanded?.(row) && (
                                            <tr>
                                                <td
                                                    colSpan={columns.length}
                                                    className="border-b border-outline-variant/15 p-0"
                                                >
                                                    {expandedRowRender(row)}
                                                </td>
                                            </tr>
                                        )}
                                </Fragment>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
