// ── Constants ─────────────────────────────────────────────────────────────────
export const SENSOR_TYPE_ICON = {
    1: "vibration",
    2: "water_drop",
    3: "rainy",
    4: "satellite_alt",
};
export const SENSOR_STATUS_CONFIG = {
    0: {
        label: "Không hoạt động",
        color: "var(--c-gray-400)",
        bg: "var(--c-gray-50)",
        text: "var(--c-gray-700)",
    },
    1: { label: "Hoạt động", color: "#1D9E75", bg: "#E1F5EE", text: "#0F6E56" },
    2: { label: "Lỗi", color: "#E24B4A", bg: "#FCEBEB", text: "#A32D2D" },
    3: {
        label: "Mất kết nối",
        color: "#BA7517",
        bg: "#FAEEDA",
        text: "#854F0B",
    },
};
export const DEVICE_STATUS_CONFIG = {
    0: { label: "Offline", color: "#E24B4A", bg: "#FCEBEB", text: "#A32D2D" },
    1: { label: "Online", color: "#1D9E75", bg: "#E1F5EE", text: "#0F6E56" },
    2: { label: "Cảnh báo", color: "#BA7517", bg: "#FAEEDA", text: "#854F0B" },
};
export const DATA_STATUS_CONFIG = {
    0: {
        label: "Bình thường",
        icon: "check_circle",
        color: "#1D9E75",
        bg: "#E1F5EE",
        text: "#0F6E56",
    },
    1: {
        label: "Cảnh báo",
        icon: "warning",
        color: "#BA7517",
        bg: "#FAEEDA",
        text: "#854F0B",
    },
    2: {
        label: "Nguy hiểm",
        icon: "dangerous",
        color: "#E24B4A",
        bg: "#FCEBEB",
        text: "#A32D2D",
    },
};

export const DEFAULT_SENSOR_FORM = { name: "", type: 1, sensorCode: "" };
