import Button from "./Button";
import { cn } from "../../utils/cn";

export default function EmptyState({
    icon = "inbox",
    title = "Không có dữ liệu",
    description,
    actionLabel,
    onAction,
    className = "",
}) {
    return (
        <div
            className={cn(
                "flex min-h-56 flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-outline-variant/50 bg-surface-container-low/35 px-6 py-10 text-center",
                className,
            )}
        >
            <span
                className="material-symbols-outlined text-5xl text-outline"
                aria-hidden="true"
            >
                {icon}
            </span>
            <div>
                <p className="text-sm font-semibold text-on-surface">{title}</p>
                {description && (
                    <p className="mt-1 text-sm text-on-surface-variant">
                        {description}
                    </p>
                )}
            </div>
            {actionLabel && onAction && (
                <Button variant="outline" onClick={onAction}>
                    {actionLabel}
                </Button>
            )}
        </div>
    );
}
