import { useState } from "react";

export default function ThresholdModal({
    editing,
    sensorTypes,
    actionTypes,
    onClose,
    onSave,
    submitting,
}) {
    const isEdit = !!editing;

    const [form, setForm] = useState(() => ({
        sensorTypeId: editing?.sensorTypeId ?? sensorTypes[0]?.id ?? "",
        minValue: editing?.minValue ?? "",
        maxValue: editing?.maxValue ?? "",
        actionType: editing?.actionType ?? 1,
    }));

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((f) => ({
            ...f,
            [name]:
                name === "sensorTypeId" || name === "actionType"
                    ? parseInt(value, 10)
                    : value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({
            sensorTypeId: form.sensorTypeId,
            minValue: parseFloat(form.minValue),
            maxValue: parseFloat(form.maxValue),
            actionType: form.actionType,
        });
    };

    const isValid =
        form.sensorTypeId &&
        form.minValue !== "" &&
        form.maxValue !== "" &&
        parseFloat(form.minValue) < parseFloat(form.maxValue);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl">
                <h3 className="text-xl font-extrabold mb-6">
                    {isEdit ? "Chỉnh sửa ngưỡng" : "Thêm ngưỡng mới"}
                </h3>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="text-xs font-bold block mb-1">
                            SensorType
                        </label>
                        <select
                            name="sensorTypeId"
                            value={form.sensorTypeId}
                            onChange={handleChange}
                            className="w-full border rounded-xl px-4 py-2.5 text-sm bg-white"
                            disabled={isEdit}
                        >
                            {sensorTypes.map((t) => (
                                <option key={t.id} value={t.id}>
                                    {t.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-xs font-bold block mb-1">
                                MinValue
                            </label>
                            <input
                                name="minValue"
                                type="number"
                                value={form.minValue}
                                onChange={handleChange}
                                className="w-full border rounded-xl px-4 py-2.5 text-sm"
                                required
                            />
                        </div>
                        <div>
                            <label className="text-xs font-bold block mb-1">
                                MaxValue
                            </label>
                            <input
                                name="maxValue"
                                type="number"
                                value={form.maxValue}
                                onChange={handleChange}
                                className="w-full border rounded-xl px-4 py-2.5 text-sm"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-xs font-bold block mb-1">
                            ActionType
                        </label>
                        <select
                            name="actionType"
                            value={form.actionType}
                            onChange={handleChange}
                            className="w-full border rounded-xl px-4 py-2.5 text-sm bg-white"
                        >
                            {actionTypes.map((t) => (
                                <option key={t.value} value={t.value}>
                                    {t.label}
                                </option>
                            ))}
                        </select>
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
                            {submitting ? "Đang lưu..." : "Lưu ngưỡng"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
