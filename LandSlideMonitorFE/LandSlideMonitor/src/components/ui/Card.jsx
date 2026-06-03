import { cn } from "../../utils/cn";

export default function Card({ className = "", children }) {
    return (
        <div
            className={cn(
                "rounded-lg border border-outline-variant/35 bg-surface-container-lowest shadow-sm",
                className,
            )}
        >
            {children}
        </div>
    );
}
