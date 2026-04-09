// Mock data for devices — replace with API calls later
export const DEVICES = [
    {
        id: "ESP32-S3-V1-992",
        location: "North Ridge / Section A",
        status: "online",
        lastSeen: "Just now",
    },
    {
        id: "ESP32-S3-V1-045",
        location: "South Slope / Basin",
        status: "online",
        lastSeen: "2 mins ago",
    },
    {
        id: "ESP32-WROOM-88",
        location: "Access Road / Gate",
        status: "offline",
        lastSeen: "4.2 hours ago",
    },
    {
        id: "ESP32-C3-MINI-01",
        location: "East Escarpment",
        status: "online",
        lastSeen: "14 mins ago",
    },
];

export const MAINTENANCE_INSIGHTS = [
    {
        id: "battery",
        icon: "battery_5_bar",
        iconColor: "text-primary",
        title: "Battery Alert",
        description:
            "2 sensors reported low battery levels in Section B. Scheduled maintenance recommended within 48h.",
    },
    {
        id: "firmware",
        icon: "update",
        iconColor: "text-secondary",
        title: "Firmware Update",
        description:
            "v2.4.1 is available. Improvements to seismic filtering for ESP32-S3 modules.",
    },
    {
        id: "signal",
        icon: "signal_cellular_alt",
        iconColor: "text-blue-500",
        title: "Signal Strength",
        description:
            "Network topology optimized. Average latency dropped to 142ms across all hubs.",
    },
];

export const NAV_ITEMS = [
    { label: "Monitoring", icon: "dashboard", path: "/monitoring" },
    { label: "Map View", icon: "map", path: "/map" },
    { label: "Alerts", icon: "notifications_active", path: "/alerts" },
    { label: "History", icon: "history", path: "/history" },
    { label: "Devices", icon: "settings_remote", path: "/devices" },
];
