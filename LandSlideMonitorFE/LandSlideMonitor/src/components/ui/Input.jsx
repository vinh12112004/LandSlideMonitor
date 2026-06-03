import { forwardRef, useId } from "react";
import { cn } from "../../utils/cn";

const Input = forwardRef(
    (
        {
            id,
            label,
            error,
            helperText,
            icon,
            className,
            containerClassName,
            ...props
        },
        ref,
    ) => {
        const generatedId = useId();
        const inputId = id || generatedId;
        const helperId = `${inputId}-helper`;
        const errorId = `${inputId}-error`;

        return (
            <div className={cn("space-y-1.5", containerClassName)}>
                {label && (
                    <label
                        htmlFor={inputId}
                        className="block text-xs font-semibold text-on-surface-variant"
                    >
                        {label}
                    </label>
                )}
                <div className="relative">
                    {icon && (
                        <span
                            className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-on-surface-variant"
                            aria-hidden="true"
                        >
                            {icon}
                        </span>
                    )}
                    <input
                        ref={ref}
                        id={inputId}
                        aria-invalid={Boolean(error)}
                        aria-describedby={
                            error ? errorId : helperText ? helperId : undefined
                        }
                        className={cn(
                            "h-10 w-full rounded-lg border border-outline-variant/70 bg-surface-container-lowest px-3 text-sm text-on-surface transition placeholder:text-outline focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:bg-surface-container disabled:text-on-surface-variant",
                            icon && "pl-10",
                            error && "border-error focus:border-error focus:ring-error/20",
                            className,
                        )}
                        {...props}
                    />
                </div>
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

Input.displayName = "Input";

export default Input;
