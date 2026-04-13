import { Marker, Popup } from "react-leaflet";
import { formatDateTime } from "../../utils/time";
import {
    createMarkerIcon,
    getDataStatusDisplay,
    getZIndexOffset,
    DEVICE_STATUS_TEXT,
} from "../../utils/map-helpers";

export default function DeviceMarker({ data }) {
    const dataStatusDisplay = getDataStatusDisplay(
        data.deviceStatus,
        data.dataStatus,
    );

    return (
        <Marker
            key={data.deviceId}
            position={[data.latitude, data.longitude]}
            icon={createMarkerIcon(data.deviceStatus, data.dataStatus)}
            zIndexOffset={getZIndexOffset(data.deviceStatus, data.dataStatus)}
        >
            <Popup>
                <div className="text-sm">
                    <h3 className="font-bold text-base mb-2">{data.name}</h3>
                    <p>
                        <strong>Device ID:</strong> {data.deviceId}
                    </p>
                    <p>
                        <strong>Location:</strong> {data.location}
                    </p>
                    <hr className="my-2" />
                    <p>
                        <strong>Device Status:</strong>{" "}
                        {DEVICE_STATUS_TEXT[data.deviceStatus] ?? "Unknown"}
                    </p>
                    <p>
                        <strong>Data Status:</strong>{" "}
                        <span
                            style={{
                                color: dataStatusDisplay.color,
                                fontWeight: 600,
                            }}
                        >
                            {dataStatusDisplay.text}
                        </span>
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                        <strong>Last Update:</strong>{" "}
                        {formatDateTime(data.timestamp)}
                    </p>
                </div>
            </Popup>
        </Marker>
    );
}
