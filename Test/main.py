import json
import time
import random
from datetime import datetime
import paho.mqtt.client as mqtt

client = mqtt.Client()
client.connect("localhost", 1883)
device_id = "ESP32_HN_01"
payload = {
    "deviceId": device_id,
    "timestamp": datetime.utcnow().isoformat(),
    "soilMoisture": random.randint(0, 100),
    "accel": {
        "x": random.uniform(-1, 1),
        "y": random.uniform(-1, 1),
        "z": random.uniform(9.5, 10.5)
    },
    "gps": {
        "lat": 21.0278,
        "lon": 105.8342
    }
}
topic = f"landslide/{device_id}/data"
client.publish(topic, json.dumps(payload))
print(payload)