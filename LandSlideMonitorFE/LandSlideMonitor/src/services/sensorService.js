import api from "../lib/axios";

export const getSensorsByDeviceId = async (deviceId) => {
    try {
        const response = await api.get(`/sensor/device/${deviceId}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching sensors for device ${deviceId}:`, error);
        throw error;
    }
};

export const createSensor = async (sensorData) => {
    try {
        const response = await api.post("/sensor", sensorData);
        return response.data;
    } catch (error) {
        console.error("Error creating sensor:", error);
        throw error;
    }
};

export const updateSensor = async (sensorId, sensorData) => {
    try {
        const response = await api.put(`/sensor/${sensorId}`, sensorData);
        return response.data;
    } catch (error) {
        console.error(`Error updating sensor ${sensorId}:`, error);
        throw error;
    }
};

export const deleteSensor = async (sensorId) => {
    try {
        await api.delete(`/sensor/${sensorId}`);
    } catch (error) {
        console.error(`Error deleting sensor ${sensorId}:`, error);
        throw error;
    }
};
