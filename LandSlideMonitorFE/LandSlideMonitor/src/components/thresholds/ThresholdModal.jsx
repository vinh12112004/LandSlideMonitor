import { useState } from "react";

export default function ThresholdModal({
    editing,
    channelDefinitions,
    levels,
    onClose,
    onSave,
    submitting,
}) {
    const isEdit = !!editing;

    const [form, setForm] = useState(() => ({
        channelDefinitionId:
            editing?.channelDefinitionId ?? channelDefinitions[0]?.id ?? "",
        level: editing?.level ?? 1,
        thresholdValue: editing?.thresholdValue ?? "",
        note: editing?.note ?? "",
    }));

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((f) => ({
            ...f,
            [name]:
                name === "channelDefinitionId" || name === "level"
                    ? parseInt(value, 10)
                    : value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({
            channelDefinitionId: form.channelDefinitionId,
            level: form.level,
            thresholdValue: parseFloat(form.thresholdValue),
            note: form.note.trim(),
        });
    };

    const isValid =
        form.channelDefinitionId &&
        form.thresholdValue !== "" &&
        !Number.isNaN(parseFloat(form.thresholdValue));

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl">
                <h3 className="text-xl font-extrabold mb-6">
                    {isEdit ? "Chỉnh sửa ngưỡng" : "Thêm ngưỡng mới"}
                </h3>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="text-xs font-bold block mb-1">
                            Channel
                        </label>
                        <select
                            name="channelDefinitionId"
                            value={form.channelDefinitionId}
                            onChange={handleChange}
                            className="w-full border rounded-xl px-4 py-2.5 text-sm bg-white"
                            disabled={isEdit}
                        >
                            {channelDefinitions.map((t) => (
                                <option key={t.id} value={t.id}>
                                    {t.name} ({t.dataKey})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="text-xs font-bold block mb-1">
                            Threshold Value
                        </label>
                        <input
                            name="thresholdValue"
                            type="number"
                            value={form.thresholdValue}
                            onChange={handleChange}
                            className="w-full border rounded-xl px-4 py-2.5 text-sm"
                            required
                        />
                    </div>

                    <div>
                        <label className="text-xs font-bold block mb-1">
                            Level
                        </label>
                        <select
                            name="level"
                            value={form.level}
                            onChange={handleChange}
                            className="w-full border rounded-xl px-4 py-2.5 text-sm bg-white"
                        >
                            {levels.map((t) => (
                                <option key={t.value} value={t.value}>
                                    {t.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="text-xs font-bold block mb-1">
                            Note
                        </label>
                        <textarea
                            name="note"
                            value={form.note}
                            onChange={handleChange}
                            className="w-full border rounded-xl px-4 py-2.5 text-sm"
                            rows={3}
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
                            {submitting ? "Đang lưu..." : "Lưu ngưỡng"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
