import { useState } from "react";

const STATUS_OPTIONS = [
    { value: 0, label: "Ngoại tuyến" },
    { value: 1, label: "Trực tuyến" },
    { value: 2, label: "Pin yếu" },
    { value: 3, label: "Bảo trì" },
];

export default function AddEditDeviceModal({
    device,
    provinces,
    onClose,
    onSave,
    submitting,
}) {
    const isEditMode = !!device;

    const getInitialFormData = () => {
        if (device) {
            return {
                deviceId: device.deviceId,
                name: device.name,
                provinceId: device.provinceId,
                status: device.status,
            };
        }
        return {
            deviceId: "",
            name: "",
            provinceId: "",
            status: 1,
        };
    };

    const [formData, setFormData] = useState(getInitialFormData);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]:
                name === "status" || name === "provinceId"
                    ? parseInt(value, 10)
                    : value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const dataToSave = isEditMode
            ? {
                  name: formData.name.trim(),
                  provinceId: formData.provinceId,
                  status: formData.status,
              }
            : {
                  deviceId: formData.deviceId.trim(),
                  name: formData.name.trim(),
                  provinceId: formData.provinceId,
              };

        onSave(dataToSave);
    };

    const isFormValid = isEditMode
        ? formData.name.trim() && formData.provinceId
        : formData.deviceId.trim() &&
          formData.name.trim() &&
          formData.provinceId;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white/100 opacity-100 z-50 rounded-3xl p-8 w-full max-w-md shadow-2xl">
                <h3 className="text-xl font-extrabold mb-6">
                    {isEditMode ? "Chỉnh sửa thiết bị" : "Thêm thiết bị mới"}
                </h3>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Device ID */}
                    {!isEditMode && (
                        <div>
                            <label className="text-xs font-bold block mb-1">
                                Mã thiết bị
                            </label>
                            <input
                                name="deviceId"
                                value={formData.deviceId}
                                onChange={handleChange}
                                className="w-full border rounded-xl px-4 py-2.5 text-sm"
                                required
                            />
                        </div>
                    )}

                    {/* Name */}
                    <div>
                        <label className="text-xs font-bold block mb-1">
                            Tên thiết bị
                        </label>
                        <input
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full border rounded-xl px-4 py-2.5 text-sm"
                            required
                        />
                    </div>

                    {/* Province */}
                    <div>
                        <label className="text-xs font-bold block mb-1">
                            Tỉnh/Thành phố
                        </label>
                        <select
                            name="provinceId"
                            value={formData.provinceId}
                            onChange={handleChange}
                            className="w-full border rounded-xl px-4 py-2.5 text-sm bg-white"
                            required
                        >
                            <option value="">-- Chọn tỉnh --</option>
                            {provinces.map((p) => (
                                <option key={p.id} value={p.id}>
                                    {p.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Status */}
                    {isEditMode && (
                        <div>
                            <label className="text-xs font-bold block mb-1">
                                Trạng thái
                            </label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className="w-full border rounded-xl px-4 py-2.5 text-sm bg-white"
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
                            className="flex-1 py-3 border rounded-xl text-sm font-bold"
                        >
                            Hủy
                        </button>

                        <button
                            type="submit"
                            disabled={submitting || !isFormValid}
                            className="flex-1 py-3 bg-primary text-white rounded-xl text-sm font-bold"
                        >
                            {submitting ? "Đang lưu..." : "Lưu thiết bị"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
