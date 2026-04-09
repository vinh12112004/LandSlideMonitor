export default function NetworkHealthCard({ devices }) {
    const total = devices.length;
    const online = devices.filter((d) => d.status === 1).length; // 1 for Online

    return (
        <div className="col-span-12 lg:col-span-4 bg-surface-container-low rounded-3xl p-8 relative overflow-hidden">
            <div className="relative z-10">
                <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-6">
                    Network Health
                </p>
                <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-extrabold font-headline text-primary">
                        {online}
                    </span>
                    <span className="text-on-surface-variant font-medium">
                        / {total} Active
                    </span>
                </div>
                {/* Progress bar visual */}
                <div className="mt-8 flex gap-2">
                    {devices.map((d, i) => (
                        <div
                            key={i}
                            className={`h-1.5 flex-1 rounded-full ${
                                d.status === 1 // 1 for Online
                                    ? "bg-secondary"
                                    : "bg-tertiary-container"
                            }`}
                        />
                    ))}
                </div>
            </div>
            {/* Background icon decoration */}
            <div className="absolute -right-4 -bottom-4 opacity-5">
                <span className="material-symbols-outlined text-9xl">hub</span>
            </div>
        </div>
    );
}
