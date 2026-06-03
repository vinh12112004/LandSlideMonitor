import { useEffect, useState } from "react";
import { GeoJSON, useMap } from "react-leaflet";

let geoDataCache = null;

const normalizeProvinceName = (name) =>
    name
        ?.toLowerCase()
        .replace("thành phố ", "")
        .replace("tp. ", "")
        .replace("tỉnh ", "")
        .trim();

export default function ProvinceBoundary({ selectedProvince, provinces }) {
    const map = useMap();
    const [geoData, setGeoData] = useState(geoDataCache);

    useEffect(() => {
        if (geoDataCache) return undefined;

        let cancelled = false;
        fetch("/data/vietnam-34.geojson")
            .then((res) => {
                if (!res.ok) {
                    throw new Error("Không tìm thấy file vietnam-34.geojson");
                }
                return res.json();
            })
            .then((data) => {
                geoDataCache = data;
                if (!cancelled) setGeoData(data);
            })
            .catch((err) => {
                console.error("GeoJSON load error:", err);
            });

        return () => {
            cancelled = true;
        };
    }, []);

    if (!geoData || selectedProvince === "all") return null;

    const selected = provinces.find(
        (province) => String(province.id) === String(selectedProvince),
    );
    if (!selected) return null;

    const selectedName = normalizeProvinceName(selected.name);
    const feature = geoData.features.find(
        (item) =>
            normalizeProvinceName(item.properties.ten_tinh) === selectedName,
    );

    if (!feature) return null;

    return (
        <GeoJSON
            key={selectedProvince}
            data={feature}
            style={{
                color: "#ff3c01",
                weight: 6,
                opacity: 1,
                fill: false,
            }}
            onEachFeature={(_feature, layer) => {
                map.fitBounds(layer.getBounds(), {
                    padding: [40, 40],
                });
            }}
        />
    );
}
