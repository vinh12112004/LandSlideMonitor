import { useState } from "react";
import { SENSOR_STATUS_CONFIG } from "../../constants/sensorConfig";

const DEFAULT_SENSOR_FORM = {
    name: "",
    channelDefinitionIds: [],
    sensorCode: "",
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
        <div
            style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0,0,0,0.45)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 1000,
            }}
            onClick={onClose}
        >
            <div
                style={{
                    background: "var(--color-background-primary)",
                    borderRadius: 16,
                    border: "0.5px solid var(--color-border-tertiary)",
                    padding: "28px 32px",
                    width: 480,
                    boxSizing: "border-box",
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 24,
                    }}
                >
                    <h2
                        style={{
                            margin: 0,
                            fontSize: 18,
                            fontWeight: 500,
                            color: "var(--color-text-primary)",
                        }}
                    >
                        {isEdit ? "Chỉnh sửa sensor" : "Thêm sensor mới"}
                    </h2>
                    <button
                        onClick={onClose}
                        style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            color: "var(--color-text-secondary)",
                            padding: 4,
                        }}
                    >
                        <span
                            className="material-symbols-outlined"
                            style={{ fontSize: 20 }}
                        >
                            close
                        </span>
                    </button>
                </div>

                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 16,
                    }}
                >
                    <div>
                        <label
                            style={{
                                fontSize: 13,
                                color: "var(--color-text-secondary)",
                                display: "block",
                                marginBottom: 6,
                            }}
                        >
                            Tên sensor
                        </label>
                        <input
                            value={form.name}
                            onChange={(e) => set("name", e.target.value)}
                            placeholder="VD: Cảm biến gia tốc chính"
                            style={{ width: "100%", boxSizing: "border-box" }}
                            className="w-full border-2 border-outline-variant/80 rounded-xl px-4 py-2.5 text-sm bg-white"
                            disabled={submitting}
                        />
                    </div>

                    {!isEdit && (
                        <div>
                            <label
                                style={{
                                    fontSize: 13,
                                    color: "var(--color-text-secondary)",
                                    display: "block",
                                    marginBottom: 6,
                                }}
                            >
                                Channel
                            </label>
                            <div
                                style={{
                                    border: "2px solid var(--color-border-tertiary)",
                                    borderRadius: 12,
                                    padding: 10,
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 8,
                                    maxHeight: 160,
                                    overflow: "auto",
                                    background: "#fff",
                                }}
                            >
                                {sensorTypes.length === 0 && (
                                    <span
                                        style={{
                                            fontSize: 13,
                                            color: "var(--color-text-secondary)",
                                        }}
                                    >
                                        Chưa có channel nào.
                                    </span>
                                )}
                                {sensorTypes.map((t) => (
                                    <label
                                        key={t.id}
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 8,
                                            fontSize: 13,
                                            color: "var(--color-text-primary)",
                                        }}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={form.channelDefinitionIds.includes(
                                                t.id,
                                            )}
                                            onChange={() => toggleChannel(t.id)}
                                            disabled={submitting}
                                        />
                                        <span>
                                            {t.name} ({t.dataKey})
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}

                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr",
                            gap: 12,
                        }}
                    >
                        <div>
                            <label
                                style={{
                                    fontSize: 13,
                                    color: "var(--color-text-secondary)",
                                    display: "block",
                                    marginBottom: 6,
                                }}
                            >
                                Trạng thái
                            </label>
                            <select
                                value={form.status}
                                onChange={(e) =>
                                    set("status", parseInt(e.target.value))
                                }
                                className="w-full border-2 border-outline-variant/80 rounded-xl px-4 py-2.5 text-sm bg-white"
                                style={{ width: "100%" }}
                                disabled={!isEdit || submitting}
                            >
                                {Object.entries(SENSOR_STATUS_CONFIG).map(
                                    ([key, { label }]) => (
                                        <option key={key} value={key}>
                                            {label}
                                        </option>
                                    ),
                                )}
                            </select>
                        </div>
                        <div>
                            <label
                                style={{
                                    fontSize: 13,
                                    color: "var(--color-text-secondary)",
                                    display: "block",
                                    marginBottom: 6,
                                }}
                            >
                                Mã sensor
                            </label>
                            <input
                                value={form.sensorCode}
                                onChange={(e) =>
                                    set("sensorCode", e.target.value)
                                }
                                placeholder="VD: ACC-01"
                                className="w-full border-2 border-outline-variant/80 rounded-xl px-4 py-2.5 text-sm bg-white"
                                style={{
                                    width: "100%",
                                    boxSizing: "border-box",
                                }}
                                disabled={isEdit || submitting}
                            />
                        </div>
                    </div>
                </div>

                <div
                    style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        gap: 10,
                        marginTop: 28,
                    }}
                >
                    <button
                        onClick={onClose}
                        style={{ padding: "8px 20px" }}
                        disabled={submitting}
                    >
                        Hủy
                    </button>
                    <button
                        onClick={handleSave}
                        style={{
                            padding: "8px 20px",
                            background: "#185FA5",
                            color: "#fff",
                            border: "none",
                            borderRadius: 8,
                            cursor: "pointer",
                            fontWeight: 500,
                        }}
                        disabled={submitting}
                    >
                        {submitting
                            ? "Đang lưu..."
                            : isEdit
                              ? "Lưu thay đổi"
                              : "Thêm sensor"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SensorModal;
