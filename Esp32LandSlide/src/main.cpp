#include <Arduino.h>
#include <WiFi.h>
#include <PubSubClient.h>

const char* ssid = "Vinh T2";
const char* password = "0989756133";

const char* mqtt_server = "192.168.1.101";
const int mqtt_port = 1883;

WiFiClient espClient;
PubSubClient client(espClient);

void setup_wifi() {
    Serial.print("Connecting WiFi");
    WiFi.begin(ssid, password);

    while (WiFi.status() != WL_CONNECTED) {
        delay(2000);
        Serial.print(".");
    }

    Serial.println("\nWiFi connected!");
}

void reconnect() {
    while (!client.connected()) {
        Serial.print("Connecting MQTT...");

        if (client.connect("esp32-test")) {
            Serial.println("connected!");
        } else {
            Serial.print("failed, rc=");
            Serial.print(client.state());
            Serial.println(" retrying...");
            delay(2000);
        }
    }
}

void setup() {
    Serial.begin(115200);
    setup_wifi();
    client.setServer(mqtt_server, mqtt_port);
}

void loop() {
    if (!client.connected()) {
        reconnect();
    }
    client.loop();


    int soil = random(2000, 4000);
    float x = random(-100, 100) / 10.0;
    float y = random(-100, 100) / 10.0;
    float z = random(900, 1100) / 100.0;

    String payload = "{";
    payload += "\"deviceId\":\"esp32-01\",";
    payload += "\"timestamp\":\"2026-04-02T14:00:00\",";
    payload += "\"soilMoisture\":" + String(soil) + ",";

    payload += "\"accel\":{";
    payload += "\"x\":" + String(x) + ",";
    payload += "\"y\":" + String(y) + ",";
    payload += "\"z\":" + String(z);
    payload += "},";

    payload += "\"gps\":{";
    payload += "\"lat\":21.0278,";
    payload += "\"lon\":105.8342";
    payload += "}";

    payload += "}";

    client.publish("landslide/esp32-01/data", payload.c_str());

    Serial.println(payload);

    delay(20000);
}