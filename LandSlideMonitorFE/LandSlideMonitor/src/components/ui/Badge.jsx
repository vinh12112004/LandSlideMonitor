import { cn } from "../../utils/cn";

const variants = {
    neutral: "bg-surface-container text-on-surface-variant ring-outline-variant/45",
    success: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    warning: "bg-amber-50 text-amber-700 ring-amber-200",
    danger: "bg-red-50 text-red-700 ring-red-200",
    info: "bg-blue-50 text-blue-700 ring-blue-200",
    primary: "bg-primary-container text-on-primary-container ring-primary/20",
};

export default function Badge({
    children,
    className,
    variant = "neutral",
    dot = false,
    ...props
}) {
    return (
        <span
            className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1",
                variants[variant],
                className,
            )}
            {...props}
        >
            {dot && (
                <span
                    className="h-1.5 w-1.5 rounded-full bg-current opacity-70"
                    aria-hidden="true"
                />
            )}
            {children}
        </span>
    );
}
