import { useState } from "react";
import { SENSOR_STATUS_CONFIG } from "../../constants/sensorConfig";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Modal from "../ui/Modal";
import Select from "../ui/Select";

const DEFAULT_SENSOR_FORM = {
    name: "",
    channelDefinitionIds: [],
    sensorCode: "",
    status: 1,
};

const SensorModal = ({
    sensor,
    deviceId,
    onClose,
    onSave,
    submitting,
    sensorTypes,
}) => {
    const isEdit = !!sensor?.id;

    const [form, setForm] = useState(
        isEdit
            ? {
                  name: sensor.name,
                  sensorCode: sensor.sensorCode,
                  status: sensor.status,
              }
            : DEFAULT_SENSOR_FORM,
    );

    const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

    const toggleChannel = (id) => {
        setForm((f) => {
            const exists = f.channelDefinitionIds.includes(id);
            const next = exists
                ? f.channelDefinitionIds.filter((x) => x !== id)
                : [...f.channelDefinitionIds, id];
            return { ...f, channelDefinitionIds: next };
        });
    };

    const handleSave = () => {
        const dataToSave = isEdit
            ? { name: form.name, status: form.status }
            : {
                  name: form.name,
                  sensorCode: form.sensorCode,
                  deviceId: deviceId,
                  channelDefinitionIds: form.channelDefinitionIds,
              };
        onSave(dataToSave, sensor?.id);
    };

    return (
        <Modal
            title={isEdit ? "Chỉnh sửa sensor" : "Thêm sensor mới"}
            description="Quản lý thông tin sensor và các kênh dữ liệu được gắn với thiết bị."
            onClose={onClose}
            size="lg"
            footer={
                <>
                    <Button
                        variant="outline"
                        onClick={onClose}
                        disabled={submitting}
                    >
                        Hủy
                    </Button>
                    <Button onClick={handleSave} isLoading={submitting}>
                        {isEdit ? "Lưu thay đổi" : "Thêm sensor"}
                    </Button>
                </>
            }
        >
            <div className="space-y-4">
                <Input
                    label="Tên sensor"
                    value={form.name}
                    onChange={(e) => set("name", e.target.value)}
                    placeholder="VD: Cảm biến gia tốc chính"
                    disabled={submitting}
                    autoFocus
                />

                {!isEdit && (
                    <fieldset>
                        <legend className="mb-2 text-xs font-semibold text-on-surface-variant">
                            Channel
                        </legend>
                        <div className="max-h-44 space-y-2 overflow-auto rounded-lg border border-outline-variant/50 bg-surface-container-lowest p-3">
                            {sensorTypes.length === 0 && (
                                <p className="text-sm text-on-surface-variant">
                                    Chưa có channel nào.
                                </p>
                            )}
                            {sensorTypes.map((t) => (
                                <label
                                    key={t.id}
                                    className="flex cursor-pointer items-center gap-2 rounded-md p-2 text-sm text-on-surface transition hover:bg-surface-container-low"
                                >
                                    <input
                                        type="checkbox"
                                        checked={form.channelDefinitionIds.includes(
                                            t.id,
                                        )}
                                        onChange={() => toggleChannel(t.id)}
                                        disabled={submitting}
                                        className="h-4 w-4 rounded border-outline-variant text-primary focus:ring-primary/25"
                                    />
                                    <span>
                                        {t.name} ({t.dataKey})
                                    </span>
                                </label>
                            ))}
                        </div>
                    </fieldset>
                )}

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Select
                        label="Trạng thái"
                        value={form.status}
                        onChange={(e) =>
                            set("status", parseInt(e.target.value, 10))
                        }
                        disabled={!isEdit || submitting}
                    >
                        {Object.entries(SENSOR_STATUS_CONFIG).map(
                            ([key, { label }]) => (
                                <option key={key} value={key}>
                                    {label}
                                </option>
                            ),
                        )}
                    </Select>
                    <Input
                        label="Mã sensor"
                        value={form.sensorCode}
                        onChange={(e) => set("sensorCode", e.target.value)}
                        placeholder="VD: ACC-01"
                        disabled={isEdit || submitting}
                    />
                </div>
            </div>
        </Modal>
    );
};

export default SensorModal;
