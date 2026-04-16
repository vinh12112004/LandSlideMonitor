import { useState, useEffect } from "react";
import deviceService from "../services/deviceService";
import sensordataService from "../services/sensordataService";
import { injectMarkerStyles } from "../utils/map-helpers";
import MapView from "../components/map/MapView";
import { getProvinces } from "../services/provinceService";
import ProvinceFilter from "../components/map/ProvinceFilter";

export default function MapViewPage() {
    const [mapData, setMapData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [provinces, setProvinces] = useState([]);
    const [selectedProvince, setSelectedProvince] = useState("all");

    useEffect(() => {
        injectMarkerStyles(); // Inject CSS animation for markers

        const fetchProvinces = async () => {
            try {
                const data = await getProvinces();
                setProvinces(data);
            } catch (err) {
                console.error("Failed to fetch provinces", err);
            }
        };

        fetchProvinces();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);

                const provinceId =
                    selectedProvince === "all" ? null : selectedProvince;

                const [devicesResponse, allLatestSensorData] =
                    await Promise.all([
                        deviceService.getAll({
                            pageNumber: 1,
                            pageSize: 9999,
                            provinceId,
                        }),
                        sensordataService.getLatestForAll({ provinceId }),
                    ]);

                const devices = devicesResponse.data;
                const sensorDataMap = new Map(
                    allLatestSensorData.map((data) => [data.deviceId, data]),
                );

                const mergedData = devices
                    .map((device) => {
                        const sensorData = sensorDataMap.get(device.deviceId);
                        const latitude =
                            sensorData?.latitude ?? device.lastLatitude;
                        const longitude =
                            sensorData?.longitude ?? device.lastLongitude;

                        if (latitude && longitude) {
                            return {
                                deviceId: device.deviceId,
                                name: device.name,
                                provinceName: device.provinceName,
                                deviceStatus: device.status,
                                latitude: latitude,
                                longitude: longitude,
                                soilMoisture: sensorData?.soilMoisture,
                                accelX: sensorData?.accelX,
                                accelY: sensorData?.accelY,
                                accelZ: sensorData?.accelZ,
                                timestamp: sensorData?.timestamp,
                                dataStatus: sensorData?.status,
                            };
                        }
                        return null;
                    })
                    .filter(Boolean);

                setMapData(mergedData);
            } catch (err) {
                setError("Failed to load map data. Please try again later.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [selectedProvince]);

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
            <ProvinceFilter
                provinces={provinces}
                selectedProvince={selectedProvince}
                onProvinceChange={setSelectedProvince}
            />
            <MapView mapData={mapData} />
        </main>
    );
}
