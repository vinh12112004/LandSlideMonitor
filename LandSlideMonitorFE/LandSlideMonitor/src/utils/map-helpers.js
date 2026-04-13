import L from "leaflet";

// --- Inject animation CSS một lần duy nhất ---
export const injectMarkerStyles = () => {
    const id = "map-marker-pulse-styles";
    if (document.getElementById(id)) return;
    const style = document.createElement("style");
    style.id = id;
    style.textContent = `
        @keyframes pulse-warning {
            0%, 100% { box-shadow: 0 0 0 0 rgba(239, 159, 39, 0.6); }
            50%       { box-shadow: 0 0 0 10px rgba(239, 159, 39, 0); }
        }
        @keyframes pulse-alert {
            0%, 100% { box-shadow: 0 0 0 0 rgba(226, 75, 74, 0.7); }
            50%       { box-shadow: 0 0 0 12px rgba(226, 75, 74, 0); }
        }
        .marker-badge-warning { animation: pulse-warning 1.4s ease-in-out infinite; }
        .marker-badge-alert { animation: pulse-alert 0.9s ease-in-out infinite; }
    `;
    document.head.appendChild(style);
};

// --- Constants ---
const DEVICE_STATUS = { OFFLINE: 0, ONLINE: 1, LOW_BATTERY: 2, MAINTENANCE: 3 };
const NO_DATA_DEVICE_STATUSES = new Set([
    DEVICE_STATUS.OFFLINE,
    DEVICE_STATUS.MAINTENANCE,
]);

export const DEVICE_STATUS_TEXT = {
    0: "Offline",
    1: "Online",
    2: "Low Battery",
    3: "Maintenance",
};
export const DATA_STATUS_TEXT = { 0: "Normal", 1: "Warning", 2: "Alert" };

const STATUS_CONFIG = {
    nodata: {
        color: "#888780",
        badgeBg: "#F1EFE8",
        badgeBorder: "#B4B2A9",
        badgeText: "#2C2C2A",
        pinSize: 32,
        icon: "&#8212;",
        pulseClass: "",
        label: "No Data",
    },
    0: {
        color: "#639922",
        badgeBg: "#EAF3DE",
        badgeBorder: "#97C459",
        badgeText: "#27500A",
        pinSize: 32,
        icon: "&#9679;",
        pulseClass: "",
        label: "Normal",
    },
    1: {
        color: "#EF9F27",
        badgeBg: "#FAEEDA",
        badgeBorder: "#EF9F27",
        badgeText: "#412402",
        pinSize: 40,
        icon: "&#9888;",
        pulseClass: "marker-badge-warning",
        label: "Warning",
    },
    2: {
        color: "#E24B4A",
        badgeBg: "#FCEBEB",
        badgeBorder: "#E24B4A",
        badgeText: "#501313",
        pinSize: 50,
        icon: "&#9679;",
        pulseClass: "marker-badge-alert",
        label: "Alert",
    },
};

// --- Helper Functions ---
const resolveStatusConfig = (deviceStatus, dataStatus) => {
    if (NO_DATA_DEVICE_STATUSES.has(deviceStatus)) {
        return STATUS_CONFIG.nodata;
    }
    return STATUS_CONFIG[dataStatus] ?? STATUS_CONFIG.nodata;
};

export const createMarkerIcon = (deviceStatus, dataStatus) => {
    const cfg = resolveStatusConfig(deviceStatus, dataStatus);
    const {
        color,
        badgeBg,
        badgeBorder,
        badgeText,
        pinSize,
        icon,
        pulseClass,
        label,
    } = cfg;

    const markerHtml = `
        <div style="display:flex; flex-direction:column; align-items:center; gap:3px;">
            <div class="${pulseClass}" style="background:${badgeBg}; color:${badgeText}; border:1px solid ${badgeBorder}; font-size:11px; font-weight:600; padding:2px 9px; border-radius:20px; white-space:nowrap; letter-spacing:0.3px;">
                ${icon}&nbsp;${label}
            </div>
            <svg viewBox="0 0 24 24" width="${pinSize}" height="${pinSize}" fill="${color}" stroke="white" stroke-width="0.6">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
        </div>`;

    const totalHeight = pinSize + 28;
    return new L.DivIcon({
        html: markerHtml,
        className: "",
        iconSize: [pinSize + 20, totalHeight],
        iconAnchor: [(pinSize + 20) / 2, totalHeight],
        popupAnchor: [0, -(totalHeight + 4)],
    });
};

export const getDataStatusDisplay = (deviceStatus, dataStatus) => {
    if (NO_DATA_DEVICE_STATUSES.has(deviceStatus)) {
        return { text: "No Data", color: STATUS_CONFIG.nodata.color };
    }
    const cfg = STATUS_CONFIG[dataStatus] ?? STATUS_CONFIG.nodata;
    return {
        text: DATA_STATUS_TEXT[dataStatus] ?? "Unknown",
        color: cfg.color,
    };
};

export const getZIndexOffset = (deviceStatus, dataStatus) => {
    if (NO_DATA_DEVICE_STATUSES.has(deviceStatus)) return 0;
    if (dataStatus === 2) return 1000; // Alert on top
    if (dataStatus === 1) return 500; // Warning below alert
    return 0; // Normal at the bottom
};
