import { MAINTENANCE_INSIGHTS } from "../../data/devices";

// MaintenanceInsights — 3 thẻ cảnh báo bảo trì
export default function MaintenanceInsights() {
    return (
        <div className="col-span-12 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {MAINTENANCE_INSIGHTS.map((insight) => (
                    <div
                        key={insight.id}
                        className="bg-surface-container-low p-6 rounded-3xl border-outline-variant/10 border"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div
                                className={`w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm ${insight.iconColor}`}
                            >
                                <span className="material-symbols-outlined">
                                    {insight.icon}
                                </span>
                            </div>
                        </div>
                        <h4 className="text-sm font-bold text-on-surface">
                            {insight.title}
                        </h4>
                        <p className="text-xs text-on-surface-variant mt-2 leading-relaxed">
                            {insight.description}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}
