const TIME_UNITS = [
    { unit: "năm", seconds: 31536000 },
    { unit: "tháng", seconds: 2592000 },
    { unit: "ngày", seconds: 86400 },
    { unit: "giờ", seconds: 3600 },
    { unit: "phút", seconds: 60 },
    { unit: "giây", seconds: 1 },
];
export function formatRelativeTime(dateString) {
    if (!dateString || dateString.startsWith("0001-01-01")) {
        return "Chưa có dữ liệu";
    }

    const pastDate = new Date(dateString + "Z");
    const now = new Date();
    const secondsAgo = Math.round((now - pastDate) / 1000);

    if (secondsAgo < 5) {
        return "Vừa xong";
    }

    for (const { unit, seconds } of TIME_UNITS) {
        const interval = Math.floor(secondsAgo / seconds);
        if (interval >= 1) {
            return `${interval} ${unit} trước`;
        }
    }

    return "Vừa xong";
}

export function formatDateTime(dateString) {
    if (!dateString) return "-";

    const d = new Date(dateString + "Z");
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();

    const hours = String(d.getHours()).padStart(2, "0");
    const minutes = String(d.getMinutes()).padStart(2, "0");

    return `${day}/${month}/${year} ${hours}:${minutes}`;
}
function formatDateLocal(date) {
    const d = new Date(date);

    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

export function getDefaultDates() {
    const today = new Date();

    const to = formatDateLocal(today);

    const fromDate = new Date();
    fromDate.setDate(today.getDate() - 7);
    const from = formatDateLocal(fromDate);

    return { from, to };
}
