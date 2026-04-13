import { useState } from "react";

const STATUS_OPTIONS = [
    { value: 0, label: "Offline" },
    { value: 1, label: "Online" },
    { value: 2, label: "Low Battery" },
    { value: 3, label: "Maintenance" },
];

export default function AddEditDeviceModal({
    device,
    onClose,
    onSave,
    submitting,
}) {
    const isEditMode = !!device;

    // 👉 Init state từ props (KHÔNG dùng useEffect)
    const getInitialFormData = () => {
        if (device) {
            return {
                deviceId: device.deviceId,
                name: device.name,
                location: device.location,
                status: device.status,
            };
        }
        return {
            deviceId: "",
            name: "",
            location: "",
            status: 1, // default Online
        };
    };

    const [formData, setFormData] = useState(getInitialFormData);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === "status" ? parseInt(value, 10) : value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const dataToSave = isEditMode
            ? {
                  name: formData.name.trim(),
                  location: formData.location.trim(),
                  status: formData.status,
              }
            : {
                  deviceId: formData.deviceId.trim(),
                  name: formData.name.trim(),
                  location: formData.location.trim(),
              };

        onSave(dataToSave);
    };

    const isFormValid = isEditMode
        ? formData.name.trim() && formData.location.trim()
        : formData.deviceId.trim() &&
          formData.name.trim() &&
          formData.location.trim();

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
            <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl">
                <h3 className="text-xl font-extrabold text-on-surface mb-6">
                    {isEditMode ? "Edit Device" : "Add New Device"}
                </h3>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Device ID (only when Add) */}
                    {!isEditMode && (
                        <div>
                            <label
                                htmlFor="deviceId"
                                className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block mb-1"
                            >
                                Device ID
                            </label>
                            <input
                                id="deviceId"
                                name="deviceId"
                                type="text"
                                placeholder="ESP32-S3-V1-001"
                                value={formData.deviceId}
                                onChange={handleChange}
                                className="w-full border border-outline-variant/40 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                                required
                            />
                        </div>
                    )}

                    {/* Name */}
                    <div>
                        <label
                            htmlFor="name"
                            className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block mb-1"
                        >
                            Device Name
                        </label>
                        <input
                            id="name"
                            name="name"
                            type="text"
                            placeholder="Sensor Alpha"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full border border-outline-variant/40 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                            required
                        />
                    </div>

                    {/* Location */}
                    <div>
                        <label
                            htmlFor="location"
                            className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block mb-1"
                        >
                            Location
                        </label>
                        <input
                            id="location"
                            name="location"
                            type="text"
                            placeholder="North Ridge / Section C"
                            value={formData.location}
                            onChange={handleChange}
                            className="w-full border border-outline-variant/40 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                            required
                        />
                    </div>

                    {/* Status (only when Edit) */}
                    {isEditMode && (
                        <div>
                            <label
                                htmlFor="status"
                                className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block mb-1"
                            >
                                Status
                            </label>
                            <select
                                id="status"
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className="w-full border border-outline-variant/40 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 bg-white"
                            >
                                {STATUS_OPTIONS.map((opt) => (
                                    <option key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={submitting}
                            className="flex-1 py-3 border border-outline-variant/30 rounded-xl text-sm font-bold text-on-surface-variant hover:bg-surface-container-low transition-colors disabled:opacity-50"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={submitting || !isFormValid}
                            className="flex-1 py-3 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {submitting ? (
                                <>
                                    <span className="material-symbols-outlined text-sm animate-spin">
                                        progress_activity
                                    </span>
                                    Đang lưu...
                                </>
                            ) : (
                                "Save Device"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
