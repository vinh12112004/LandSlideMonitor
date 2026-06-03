export default function NetworkHealthCard({ devices }) {
    const total = devices.length;
    const online = devices.filter((device) => device.status === 1).length;
    const ratio = total > 0 ? Math.round((online / total) * 100) : 0;

    return (
        <section className="overflow-hidden rounded-lg border border-outline-variant/30 bg-surface-container-lowest p-6 shadow-sm">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <p className="mb-2 text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                        Tình trạng mạng lưới
                    </p>
                    <div className="flex items-baseline gap-2">
                        <span className="font-headline text-4xl font-extrabold text-primary">
                            {online}
                        </span>
                        <span className="font-medium text-on-surface-variant">
                            / {total} đang hoạt động
                        </span>
                    </div>
                </div>
                <div className="flex items-center gap-3 text-sm text-on-surface-variant">
                    <span className="font-bold text-on-surface">{ratio}%</span>
                    Online
                </div>
            </div>
            <div className="mt-5 flex w-full gap-1.5">
                {devices.length > 0 ? (
                    devices.map((device) => (
                        <div
                            key={device.deviceId}
                            className={`h-2 flex-1 rounded-full ${
                                device.status === 1
                                    ? "bg-secondary"
                                    : "bg-error-container"
                            }`}
                        />
                    ))
                ) : (
                    <div className="h-2 flex-1 rounded-full bg-surface-container" />
                )}
            </div>
        </section>
    );
}
