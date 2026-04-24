import json
import random
from datetime import datetime
import paho.mqtt.client as mqtt

client = mqtt.Client()
client.connect("localhost", 1883)

device_id = "ESP32_HN_01"

# Payload khớp với cấu trúc SensorDataDto và các Channel đã khai báo
payload = {
    "DeviceId": device_id,
    "Timestamp": datetime.utcnow().isoformat() + "Z",
    "Data": {
        "soil_m": round(random.uniform(40, 50), 2),
        "vib": round(random.uniform(0, 0.1), 3),
        "tilt": round(random.uniform(0, 2), 2),
        # Các channel mới cho ZED-F9P
        "lat": 20.9612345,
        "lon": 105.8212345,
        "alt": 15.234,      # Độ cao cực kỳ quan trọng để theo dõi sụt lún
        "fix_type": 3,      # 3: RTK Fixed (cm), 2: RTK Float (dm), 1: GPS Thường
        "satellites": 22,    # Số vệ tinh thu được
        "t_disp": round(random.uniform(0, 10), 2)
    }
}

topic = f"landslide/{device_id}/data"
client.publish(topic, json.dumps(payload))

print(f"Bản tin đã gửi với {len(payload['Data'])} channels.")