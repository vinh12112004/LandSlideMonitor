export default function Pagination({
    currentPage,
    totalPages,
    total,
    pageSize,
    onPageChange,
}) {
    const from = total === 0 ? 0 : (currentPage - 1) * pageSize + 1;
    const to = Math.min(currentPage * pageSize, total);

    const getPages = () => {
        const pages = [];
        if (totalPages <= 5) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            pages.push(1);
            if (currentPage > 3) pages.push("...");
            for (
                let i = Math.max(2, currentPage - 1);
                i <= Math.min(totalPages - 1, currentPage + 1);
                i++
            ) {
                pages.push(i);
            }
            if (currentPage < totalPages - 2) pages.push("...");
            pages.push(totalPages);
        }
        return pages;
    };

    return (
        <div className="flex flex-col gap-3 border-x border-b border-outline-variant/25 bg-surface-container-low/30 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <p className="text-xs text-on-surface-variant font-medium">
                Hiển thị{" "}
                <span className="text-on-surface">
                    {from}-{to}
                </span>{" "}
                trên{" "}
                <span className="text-on-surface">
                    {total.toLocaleString()}
                </span>{" "}
                kết quả
            </p>
            <div className="flex items-center gap-1">
                <button
                    type="button"
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="rounded-lg p-2 text-outline hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 disabled:opacity-30"
                    aria-label="Trang trước"
                >
                    <span className="material-symbols-outlined">
                        chevron_left
                    </span>
                </button>

                {getPages().map((page, i) =>
                    page === "..." ? (
                        <span
                            key={`ellipsis-${i}`}
                            className="px-2 text-outline text-xs"
                        >
                            ...
                        </span>
                    ) : (
                        <button
                            type="button"
                            key={page}
                            onClick={() => onPageChange(page)}
                            aria-current={
                                page === currentPage ? "page" : undefined
                            }
                            className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-medium transition-colors ${
                                page === currentPage
                                    ? "bg-primary text-white font-bold shadow-md shadow-primary/20"
                                    : "hover:bg-surface-container"
                            }`}
                        >
                            {page}
                        </button>
                    ),
                )}

                <button
                    type="button"
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="rounded-lg p-2 text-outline hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 disabled:opacity-30"
                    aria-label="Trang sau"
                >
                    <span className="material-symbols-outlined">
                        chevron_right
                    </span>
                </button>
            </div>
        </div>
    );
}
