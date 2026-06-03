import { forwardRef } from "react";
import { cn } from "../../utils/cn";

const variants = {
    primary:
        "bg-primary text-on-primary shadow-sm shadow-primary/20 hover:bg-primary/90",
    secondary:
        "bg-surface-container text-on-surface hover:bg-surface-container-high",
    outline:
        "border border-outline-variant bg-surface-container-lowest text-on-surface hover:bg-surface-container-low",
    ghost: "text-on-surface-variant hover:bg-surface-container hover:text-on-surface",
    danger: "bg-error text-on-error shadow-sm hover:bg-error/90",
};

const sizes = {
    sm: "h-9 px-3 text-xs",
    md: "h-10 px-4 text-sm",
    lg: "h-11 px-5 text-sm",
    icon: "h-9 w-9 p-0",
};

const Button = forwardRef(
    (
        {
            children,
            className,
            variant = "primary",
            size = "md",
            type = "button",
            isLoading = false,
            disabled,
            ...props
        },
        ref,
    ) => (
        <button
            ref={ref}
            type={type}
            disabled={disabled || isLoading}
            className={cn(
                "inline-flex shrink-0 items-center justify-center gap-2 rounded-lg font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35 focus-visible:ring-offset-2 focus-visible:ring-offset-surface disabled:pointer-events-none disabled:opacity-55",
                variants[variant],
                sizes[size],
                className,
            )}
            {...props}
        >
            {isLoading && (
                <span
                    className="material-symbols-outlined animate-spin text-[18px]"
                    aria-hidden="true"
                >
                    progress_activity
                </span>
            )}
            {children}
        </button>
    ),
);

Button.displayName = "Button";

export default Button;
