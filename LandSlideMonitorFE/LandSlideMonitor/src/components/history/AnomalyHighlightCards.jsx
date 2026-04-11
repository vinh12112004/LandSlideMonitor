// AnomalyHighlightCard — 2 card dưới cùng: anomaly detection + network health
export default function AnomalyHighlightCards({
    networkHealth = "98.4%",
    activeSensors = 142,
    zones = 5,
}) {
    return (
        <div className="grid grid-cols-12 gap-6 pt-4">
            {/* Anomaly detection card */}
            <div className="col-span-12 lg:col-span-8 bg-surface-container-low rounded-3xl p-8 relative overflow-hidden">
                <div className="relative z-10">
                    <h3 className="text-2xl font-extrabold font-headline mb-4">
                        Anomalous Activity Detection
                    </h3>
                    <p className="text-on-surface-variant max-w-lg mb-6">
                        Our sentient topography model has detected a 12%
                        increase in soil moisture on North Ridge Cluster Alpha.
                        Displacement monitoring is recommended for the next 24
                        hours.
                    </p>
                    <button className="bg-on-surface text-surface py-3 px-6 rounded-full font-bold text-sm hover:opacity-90 transition-all">
                        Review Cluster Data
                    </button>
                </div>
                {/* Decorative gradient */}
                <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/5 to-transparent pointer-events-none" />
            </div>

            {/* Network health card */}
            <div className="col-span-12 lg:col-span-4 bg-primary text-on-primary rounded-3xl p-8 flex flex-col justify-between shadow-xl shadow-primary/20">
                <div>
                    <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-sm">
                        <span
                            className="material-symbols-outlined"
                            style={{ fontVariationSettings: '"FILL" 1' }}
                        >
                            sensors
                        </span>
                    </div>
                    <h3 className="text-3xl font-extrabold font-headline leading-tight">
                        {networkHealth}
                        <br />
                        Network Health
                    </h3>
                </div>
                <div className="pt-6 border-t border-white/10">
                    <p className="text-sm font-medium opacity-80">
                        {activeSensors} sensors active across {zones} zones.
                    </p>
                </div>
            </div>
        </div>
    );
}
