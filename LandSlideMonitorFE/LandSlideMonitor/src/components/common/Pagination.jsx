export default function Pagination({
    currentPage,
    totalPages,
    total,
    pageSize,
    onPageChange,
}) {
    const from = (currentPage - 1) * pageSize + 1;
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
        <div className="px-6 py-4 bg-surface-container-low/30 border-t border-outline-variant/15 flex items-center justify-between">
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
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 text-outline-variant hover:text-primary disabled:opacity-30"
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
                            key={page}
                            onClick={() => onPageChange(page)}
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
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 text-on-surface hover:text-primary disabled:opacity-30"
                >
                    <span className="material-symbols-outlined">
                        chevron_right
                    </span>
                </button>
            </div>
        </div>
    );
}
