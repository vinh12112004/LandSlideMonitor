import { forwardRef, useId } from "react";
import { cn } from "../../utils/cn";

const Select = forwardRef(
    (
        {
            id,
            label,
            error,
            helperText,
            className,
            containerClassName,
            children,
            ...props
        },
        ref,
    ) => {
        const generatedId = useId();
        const selectId = id || generatedId;
        const helperId = `${selectId}-helper`;
        const errorId = `${selectId}-error`;

        return (
            <div className={cn("space-y-1.5", containerClassName)}>
                {label && (
                    <label
                        htmlFor={selectId}
                        className="block text-xs font-semibold text-on-surface-variant"
                    >
                        {label}
                    </label>
                )}
                <select
                    ref={ref}
                    id={selectId}
                    aria-invalid={Boolean(error)}
                    aria-describedby={
                        error ? errorId : helperText ? helperId : undefined
                    }
                    className={cn(
                        "h-10 w-full rounded-lg border border-outline-variant/70 bg-surface-container-lowest px-3 text-sm text-on-surface transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:bg-surface-container disabled:text-on-surface-variant",
                        error && "border-error focus:border-error focus:ring-error/20",
                        className,
                    )}
                    {...props}
                >
                    {children}
                </select>
                {helperText && !error && (
                    <p id={helperId} className="text-xs text-on-surface-variant">
                        {helperText}
                    </p>
                )}
                {error && (
                    <p id={errorId} className="text-xs font-medium text-error">
                        {error}
                    </p>
                )}
            </div>
        );
    },
);

Select.displayName = "Select";

export default Select;
