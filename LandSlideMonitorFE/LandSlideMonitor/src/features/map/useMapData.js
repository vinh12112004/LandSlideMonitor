import { useCallback, useEffect, useState } from "react";
import deviceService from "../../services/deviceService";
import sensordataService from "../../services/sensordataService";

export function useMapData(selectedProvince) {
    const [mapData, setMapData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const provinceId =
                selectedProvince === "all" ? null : selectedProvince;

            const [devicesResponse, allLatestSensorData] = await Promise.all([
                deviceService.getAll({
                    pageNumber: 1,
                    pageSize: 9999,
                    provinceId,
                }),
                sensordataService.getLatestForAll({ provinceId }),
            ]);

            const devices = devicesResponse.data || [];
            const sensorDataMap = new Map(
                (allLatestSensorData || []).map((data) => [
                    data.deviceId,
                    data,
                ]),
            );

            const mergedData = devices
                .map((device) => {
                    const sensorData = sensorDataMap.get(device.deviceId);
                    const latitude = sensorData?.latitude ?? device.lastLatitude;
                    const longitude =
                        sensorData?.longitude ?? device.lastLongitude;

                    if (!latitude || !longitude) return null;

                    return {
                        deviceId: device.deviceId,
                        name: device.name,
                        provinceName: device.provinceName,
                        deviceStatus: device.status,
                        latitude,
                        longitude,
                        soilMoisture: sensorData?.soilMoisture,
                        accelX: sensorData?.accelX,
                        accelY: sensorData?.accelY,
                        accelZ: sensorData?.accelZ,
                        timestamp: sensorData?.timestamp,
                        dataStatus: sensorData?.status,
                    };
                })
                .filter(Boolean);

            setMapData(mergedData);
        } catch (err) {
            setError("Không thể tải dữ liệu bản đồ. Vui lòng thử lại.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [selectedProvince]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return { mapData, loading, error, refetch: fetchData };
}
