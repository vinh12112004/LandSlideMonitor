import { useEffect, useState } from "react";
import { GeoJSON, useMap } from "react-leaflet";

export default function ProvinceBoundary({ selectedProvince, provinces }) {
    const map = useMap();
    const [geoData, setGeoData] = useState(null);

    // Chuẩn hóa tên tỉnh
    const normalizeProvinceName = (name) => {
        return name
            ?.toLowerCase()
            .replace("thành phố ", "")
            .replace("tp. ", "")
            .replace("tỉnh ", "")
            .trim();
    };

    // Load GeoJSON
    useEffect(() => {
        console.log("Loading GeoJSON...");

        fetch("/data/vietnam-34.geojson")
            .then((res) => {
                console.log("Fetch status:", res.status);

                if (!res.ok) {
                    throw new Error("Không tìm thấy file vietnam-34.geojson");
                }

                return res.json();
            })
            .then((data) => {
                console.log("GeoJSON loaded");
                console.log("Total provinces:", data.features.length);

                setGeoData(data);
            })
            .catch((err) => {
                console.error("GeoJSON load error:", err);
            });
    }, []);

    // Chưa load xong
    if (!geoData) {
        console.log("GeoJSON chưa sẵn sàng");
        return null;
    }

    // Đang chọn tất cả
    if (selectedProvince === "all") {
        console.log("Hiển thị tất cả tỉnh");
        return null;
    }

    // Tìm tỉnh được chọn
    const selected = provinces.find(
        (p) => String(p.id) === String(selectedProvince),
    );

    console.log("Selected province:", selected);

    if (!selected) {
        console.warn("Không tìm thấy selected province");
        return null;
    }

    // Chuẩn hóa tên backend
    const selectedName = normalizeProvinceName(selected.name);

    console.log("Selected normalized:", selectedName);

    // Tìm feature tương ứng trong GeoJSON
    const feature = geoData.features.find((f) => {
        const geoName = f.properties.ten_tinh;

        const geoNormalized = normalizeProvinceName(geoName);

        console.log("Compare:", geoNormalized, selectedName);

        return geoNormalized === selectedName;
    });

    // Không tìm thấy
    if (!feature) {
        console.warn("Không tìm thấy tỉnh trong GeoJSON:", selected.name);

        console.log(
            "Danh sách tỉnh GeoJSON:",
            geoData.features.map((f) => f.properties.ten_tinh),
        );

        return null;
    }

    console.log("Highlighting province:", selected.name);

    return (
        <GeoJSON
            key={selectedProvince}
            data={feature}
            style={{
                color: "#ff3c01",
                weight: 8,
                opacity: 1,
                fill: false,
            }}
            onEachFeature={(feature, layer) => {
                console.log("Province bounds:", layer.getBounds());

                map.fitBounds(layer.getBounds(), {
                    padding: [40, 40],
                });
            }}
        />
    );
}
