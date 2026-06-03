import { useState } from "react";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Modal from "../ui/Modal";
import Select from "../ui/Select";

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
                    ? value
                        ? parseInt(value, 10)
                        : ""
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
        <Modal
            title={isEditMode ? "Chỉnh sửa thiết bị" : "Thêm thiết bị mới"}
            description="Cập nhật thông tin định danh, khu vực và trạng thái thiết bị."
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
                        form="device-form"
                        disabled={!isFormValid}
                        isLoading={submitting}
                    >
                        Lưu thiết bị
                    </Button>
                </>
            }
        >
            <form id="device-form" onSubmit={handleSubmit} className="space-y-4">
                {!isEditMode && (
                    <Input
                        label="Mã thiết bị"
                        name="deviceId"
                        value={formData.deviceId}
                        onChange={handleChange}
                        required
                        autoFocus
                    />
                )}
                <Input
                    label="Tên thiết bị"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    autoFocus={isEditMode}
                />
                <Select
                    label="Tỉnh/Thành phố"
                    name="provinceId"
                    value={formData.provinceId}
                    onChange={handleChange}
                    required
                >
                    <option value="">Chọn tỉnh/thành phố</option>
                    {provinces.map((p) => (
                        <option key={p.id} value={p.id}>
                            {p.name}
                        </option>
                    ))}
                </Select>
                {isEditMode && (
                    <Select
                        label="Trạng thái"
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                    >
                        {STATUS_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </Select>
                )}
            </form>
        </Modal>
    );
}
