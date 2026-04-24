import { useState } from "react";

export default function SensorTypeModal({
    editing,
    onClose,
    onSave,
    submitting,
}) {
    const isEdit = !!editing;

    const [form, setForm] = useState({
        name: editing?.name || "",
        dataKey: editing?.dataKey || "",
        unitSymbol: editing?.unitSymbol || "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((f) => ({ ...f, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({
            name: form.name.trim(),
            dataKey: form.dataKey.trim(),
            unitSymbol: form.unitSymbol.trim(),
        });
    };

    const isValid =
        form.name.trim() && form.dataKey.trim() && form.unitSymbol.trim();

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl">
                <h3 className="text-xl font-extrabold mb-6">
                    {isEdit ? "Chỉnh sửa SensorType" : "Thêm SensorType"}
                </h3>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="text-xs font-bold block mb-1">
                            Tên loại
                        </label>
                        <input
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            className="w-full border-2 border-outline-variant/80 rounded-xl px-4 py-2.5 text-sm bg-white"
                            placeholder="VD: SoilMoisture"
                            required
                        />
                    </div>

                    <div>
                        <label className="text-xs font-bold block mb-1">
                            DataKey
                        </label>
                        <input
                            name="dataKey"
                            value={form.dataKey}
                            onChange={handleChange}
                            className="w-full border-2 border-outline-variant/80 rounded-xl px-4 py-2.5 text-sm bg-white"
                            placeholder="VD: soil_m"
                            required
                        />
                    </div>
                    <div>
                        <label className="text-xs font-bold block mb-1">
                            Đơn vị
                        </label>
                        <input
                            name="unitSymbol"
                            value={form.unitSymbol}
                            onChange={handleChange}
                            className="w-full border-2 border-outline-variant/80 rounded-xl px-4 py-2.5 text-sm bg-white"
                            placeholder="VD: %, g, mm"
                            required
                        />
                    </div>
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
                            disabled={submitting || !isValid}
                            className="flex-1 py-3 bg-primary text-white rounded-xl text-sm font-bold"
                        >
                            {submitting ? "Đang lưu..." : "Lưu"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
