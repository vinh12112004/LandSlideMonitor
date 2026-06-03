import { cn } from "../../utils/cn";

export function Tabs({ children, className = "", label = "Tabs" }) {
    return (
        <div
            role="tablist"
            aria-label={label}
            className={cn(
                "flex gap-1 border-b border-outline-variant/30",
                className,
            )}
        >
            {children}
        </div>
    );
}

export function TabButton({ active, icon, children, onClick }) {
    return (
        <button
            type="button"
            role="tab"
            aria-selected={active}
            onClick={onClick}
            className={cn(
                "-mb-px inline-flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30",
                active
                    ? "border-primary text-primary"
                    : "border-transparent text-on-surface-variant hover:text-on-surface",
            )}
        >
            {icon && (
                <span
                    className="material-symbols-outlined text-[18px]"
                    aria-hidden="true"
                >
                    {icon}
                </span>
            )}
            {children}
        </button>
    );
}
