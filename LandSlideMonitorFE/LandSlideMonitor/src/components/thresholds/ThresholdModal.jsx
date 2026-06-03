import { useState } from "react";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Modal from "../ui/Modal";
import Select from "../ui/Select";

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
        <Modal
            title={isEdit ? "Chỉnh sửa ngưỡng" : "Thêm ngưỡng mới"}
            description="Thiết lập giá trị ngưỡng theo kênh dữ liệu và mức cảnh báo."
            onClose={onClose}
            footer={
                <>
                    <Button
                        variant="outline"
                        onClick={onClose}
                        disabled={submitting}
                    >
                        Hủy
                    </Button>
                    <Button
                        type="submit"
                        form="threshold-form"
                        disabled={!isValid}
                        isLoading={submitting}
                    >
                        Lưu ngưỡng
                    </Button>
                </>
            }
        >
            <form
                id="threshold-form"
                onSubmit={handleSubmit}
                className="space-y-4"
            >
                <Select
                    label="Kênh"
                    name="channelDefinitionId"
                    value={form.channelDefinitionId}
                    onChange={handleChange}
                    disabled={isEdit}
                >
                    {channelDefinitions.map((t) => (
                        <option key={t.id} value={t.id}>
                            {t.name} ({t.dataKey})
                        </option>
                    ))}
                </Select>
                <Input
                    label="Giá trị ngưỡng"
                    name="thresholdValue"
                    type="number"
                    value={form.thresholdValue}
                    onChange={handleChange}
                    required
                />
                <Select
                    label="Mức"
                    name="level"
                    value={form.level}
                    onChange={handleChange}
                >
                    {levels.map((t) => (
                        <option key={t.value} value={t.value}>
                            {t.label}
                        </option>
                    ))}
                </Select>
                <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-on-surface-variant">
                        Ghi chú
                    </label>
                    <textarea
                        name="note"
                        value={form.note}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-outline-variant/70 bg-surface-container-lowest px-3 py-2.5 text-sm text-on-surface transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                        rows={3}
                    />
                </div>
            </form>
        </Modal>
    );
}
