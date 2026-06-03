import { useEffect, useId, useRef } from "react";
import Button from "./Button";
import { cn } from "../../utils/cn";

const sizes = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
};

export default function Modal({
    open = true,
    title,
    description,
    children,
    footer,
    onClose,
    size = "md",
    closeOnBackdrop = true,
    closeOnEscape = true,
    className = "",
}) {
    const titleId = useId();
    const descriptionId = useId();
    const panelRef = useRef(null);
    const previousFocusRef = useRef(null);

    useEffect(() => {
        if (!open) return undefined;

        previousFocusRef.current = document.activeElement;
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        window.setTimeout(() => panelRef.current?.focus(), 0);

        const handleKeyDown = (event) => {
            if (event.key === "Escape" && closeOnEscape) {
                onClose?.();
            }
        };

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.body.style.overflow = previousOverflow;
            document.removeEventListener("keydown", handleKeyDown);
            previousFocusRef.current?.focus?.();
        };
    }, [closeOnEscape, onClose, open]);

    if (!open) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-on-surface/45 p-4 backdrop-blur-sm"
            onMouseDown={(event) => {
                if (event.target === event.currentTarget && closeOnBackdrop) {
                    onClose?.();
                }
            }}
        >
            <section
                ref={panelRef}
                tabIndex={-1}
                role="dialog"
                aria-modal="true"
                aria-labelledby={title ? titleId : undefined}
                aria-describedby={description ? descriptionId : undefined}
                className={cn(
                    "max-h-[calc(100vh-2rem)] w-full overflow-hidden rounded-lg border border-outline-variant/40 bg-surface-container-lowest shadow-2xl outline-none",
                    sizes[size],
                    className,
                )}
                onMouseDown={(event) => event.stopPropagation()}
            >
                {(title || onClose) && (
                    <header className="flex items-start justify-between gap-4 border-b border-outline-variant/25 px-6 py-5">
                        <div>
                            {title && (
                                <h2
                                    id={titleId}
                                    className="text-lg font-bold tracking-tight text-on-surface"
                                >
                                    {title}
                                </h2>
                            )}
                            {description && (
                                <p
                                    id={descriptionId}
                                    className="mt-1 text-sm text-on-surface-variant"
                                >
                                    {description}
                                </p>
                            )}
                        </div>
                        {onClose && (
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={onClose}
                                aria-label="Đóng"
                            >
                                <span
                                    className="material-symbols-outlined text-[20px]"
                                    aria-hidden="true"
                                >
                                    close
                                </span>
                            </Button>
                        )}
                    </header>
                )}
                <div className="max-h-[calc(100vh-12rem)] overflow-y-auto px-6 py-5">
                    {children}
                </div>
                {footer && (
                    <footer className="flex justify-end gap-3 border-t border-outline-variant/25 bg-surface-container-low/45 px-6 py-4">
                        {footer}
                    </footer>
                )}
            </section>
        </div>
    );
}
