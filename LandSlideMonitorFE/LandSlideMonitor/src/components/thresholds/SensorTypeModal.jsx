import { useState } from "react";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Modal from "../ui/Modal";

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

    const isValid = form.name.trim() && form.dataKey.trim();

    return (
        <Modal
            title={isEdit ? "Chỉnh sửa kênh" : "Thêm kênh"}
            description="Định nghĩa tên kênh, data key và đơn vị đo từ backend."
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
                        form="sensor-type-form"
                        disabled={!isValid}
                        isLoading={submitting}
                    >
                        Lưu
                    </Button>
                </>
            }
        >
            <form
                id="sensor-type-form"
                onSubmit={handleSubmit}
                className="space-y-4"
            >
                <Input
                    label="Tên loại"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="VD: SoilMoisture"
                    required
                    autoFocus
                />
                <Input
                    label="DataKey"
                    name="dataKey"
                    value={form.dataKey}
                    onChange={handleChange}
                    placeholder="VD: soil_m"
                    required
                />
                <Input
                    label="Đơn vị"
                    name="unitSymbol"
                    value={form.unitSymbol}
                    onChange={handleChange}
                    placeholder="VD: %, g, mm"
                />
            </form>
        </Modal>
    );
}
