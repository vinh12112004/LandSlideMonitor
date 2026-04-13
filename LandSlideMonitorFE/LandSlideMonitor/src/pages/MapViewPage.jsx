import { useState, useEffect } from "react";
import deviceService from "../services/deviceService";
import sensordataService from "../services/sensordataService";
import { injectMarkerStyles } from "../utils/map-helpers";
import MapView from "../components/map/MapView";

export default function MapViewPage() {
    const [mapData, setMapData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        injectMarkerStyles(); // Chèn CSS animation cho marker

        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);

                const [devices, allLatestSensorData] = await Promise.all([
                    deviceService.getAll(),
                    sensordataService.getLatestForAll(),
                ]);

                const sensorDataMap = new Map(
                    allLatestSensorData.map((data) => [data.deviceId, data]),
                );

                const mergedData = devices
                    .map((device) => {
                        const sensorData = sensorDataMap.get(device.deviceId);
                        // Chỉ xử lý nếu có dữ liệu cảm biến và tọa độ hợp lệ
                        if (
                            sensorData &&
                            sensorData.latitude &&
                            sensorData.longitude
                        ) {
                            return {
                                deviceId: device.deviceId,
                                name: device.name,
                                location: device.location,
                                deviceStatus: device.status,
                                latitude: sensorData.latitude,
                                longitude: sensorData.longitude,
                                soilMoisture: sensorData.soilMoisture,
                                accelX: sensorData.accelX,
                                accelY: sensorData.accelY,
                                accelZ: sensorData.accelZ,
                                timestamp: sensorData.timestamp,
                                dataStatus: sensorData.status,
                            };
                        }
                        return null;
                    })
                    .filter(Boolean); // Lọc bỏ các giá trị null

                setMapData(mergedData);
            } catch (err) {
                setError("Failed to load map data. Please try again later.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []); // Chạy một lần khi component được mount

    if (loading) {
        return (
            <main className="ml-64 p-10 bg-surface min-h-[calc(100vh-64px)] flex items-center justify-center">
                <div className="text-center">
                    <span className="material-symbols-outlined text-5xl text-primary animate-spin block mb-4">
                        progress_activity
                    </span>
                    <p className="text-on-surface-variant text-sm">
                        Loading Map Data...
                    </p>
                </div>
            </main>
        );
    }

    if (error) {
        return (
            <main className="ml-64 p-10 bg-surface min-h-[calc(100vh-64px)] flex items-center justify-center">
                <div className="text-center">
                    <span className="material-symbols-outlined text-5xl text-tertiary block mb-4">
                        error_outline
                    </span>
                    <p className="text-on-surface font-bold mb-2">
                        An Error Occurred
                    </p>
                    <p className="text-on-surface-variant text-sm">{error}</p>
                </div>
            </main>
        );
    }

    return (
        <main className="ml-64 h-[calc(100vh-64px)]">
            <MapView mapData={mapData} />
        </main>
    );
}
