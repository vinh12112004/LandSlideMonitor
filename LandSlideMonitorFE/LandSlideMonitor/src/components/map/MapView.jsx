import { MapContainer, TileLayer } from "react-leaflet";
import DeviceMarker from "./DeviceMarker";

export default function MapView({ mapData }) {
    // Mặc định tọa độ trung tâm nếu không có dữ liệu
    const mapCenter =
        mapData.length > 0
            ? [mapData[0].latitude, mapData[0].longitude]
            : [10.8231, 106.6297]; // Tọa độ mặc định (TP.HCM)

    return (
        <MapContainer
            center={mapCenter}
            zoom={13}
            style={{ height: "100%", width: "100%" }}
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {mapData.map((data) => (
                <DeviceMarker key={data.deviceId} data={data} />
            ))}
        </MapContainer>
    );
}
