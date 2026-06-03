import { cn } from "../../utils/cn";

export default function LoadingState({
    message = "Đang tải dữ liệu...",
    className = "",
}) {
    return (
        <div
            className={cn(
                "flex min-h-64 flex-col items-center justify-center gap-3 text-center text-on-surface-variant",
                className,
            )}
            aria-live="polite"
            aria-busy="true"
        >
            <span
                className="material-symbols-outlined animate-spin text-4xl text-primary"
                aria-hidden="true"
            >
                progress_activity
            </span>
            <p className="text-sm font-medium">{message}</p>
        </div>
    );
}
