import { useEffect } from "react";
import { MapContainer, TileLayer, LayersControl, useMap } from "react-leaflet";
import { GeoSearchControl, OpenStreetMapProvider } from "leaflet-geosearch";
import "leaflet-geosearch/dist/geosearch.css";
import DeviceMarker from "./DeviceMarker";
import ProvinceBoundary from "./ProvinceBoundary";

class VietnamMapProvider extends OpenStreetMapProvider {
    async search({ query }) {
        const text = query.toLowerCase();

        if (text.includes("hoàng sa") || text.includes("hoang sa")) {
            return [
                {
                    x: 111.6044049,
                    y: 16.5340784,
                    label: "Quần đảo Hoàng Sa, Đà Nẵng, Việt Nam",
                    bounds: [
                        [15.0, 111.0],
                        [17.5, 113.0],
                    ],
                },
            ];
        }

        if (text.includes("trường sa") || text.includes("truong sa")) {
            return [
                {
                    x: 111.9176003,
                    y: 8.644639,
                    label: "Quần đảo Trường Sa, Khánh Hòa, Việt Nam",
                    bounds: [
                        [7.0, 111.5],
                        [11.5, 115.5],
                    ],
                },
            ];
        }

        return super.search({ query });
    }
}

function SearchField() {
    const map = useMap();

    useEffect(() => {
        const provider = new VietnamMapProvider();
        const searchControl = new GeoSearchControl({
            provider: provider,
            style: "bar",
            showMarker: true,
            retainZoomLevel: false,
            animateZoom: true,
            autoClose: true,
            searchLabel: "Nhập địa điểm cần tìm ",
            keepResult: true,
        });

        map.addControl(searchControl);
        return () => map.removeControl(searchControl);
    }, [map]);

    return null;
}

export default function MapView({ mapData, provinces, selectedProvince }) {
    const mapCenter =
        mapData.length > 0
            ? [mapData[0].latitude, mapData[0].longitude]
            : [10.8231, 106.6297];

    return (
        <MapContainer
            center={mapCenter}
            zoom={11.3}
            style={{ height: "100%", width: "100%" }}
        >
            {/* Bộ điều khiển chuyển đổi lớp bản đồ */}
            <LayersControl position="topright">
                {/* Chế độ Đường phố */}
                <LayersControl.BaseLayer name="Bản đồ Đường phố">
                    <TileLayer
                        url="https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}&hl=vi&gl=VN"
                        attribution="&copy; Google Maps"
                    />
                </LayersControl.BaseLayer>

                {/* Chế độ Vệ tinh (Mặc định bật) */}
                <LayersControl.BaseLayer checked name="Bản đồ Vệ tinh">
                    <TileLayer
                        url="https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}&hl=vi&gl=VN"
                        attribution="&copy; Google Maps"
                    />
                </LayersControl.BaseLayer>

                {/* Chế độ Địa hình */}
                <LayersControl.BaseLayer name="Bản đồ Địa hình">
                    <TileLayer
                        url="https://mt1.google.com/vt/lyrs=p&x={x}&y={y}&z={z}&hl=vi&gl=VN"
                        attribution="&copy; Google Maps"
                    />
                </LayersControl.BaseLayer>
            </LayersControl>

            {/* Render các thiết bị */}
            {mapData.map((data) => (
                <DeviceMarker key={data.deviceId} data={data} />
            ))}

            {/* Thanh tìm kiếm */}
            <SearchField />
            <ProvinceBoundary
                selectedProvince={selectedProvince}
                provinces={provinces}
            />
        </MapContainer>
    );
}
