import serial
import time

PORT = "/dev/ttyACM0"
BAUD = 115200

def ubx_checksum(data):
    ck_a = 0
    ck_b = 0
    for b in data:
        ck_a = (ck_a + b) & 0xFF
        ck_b = (ck_b + ck_a) & 0xFF
    return bytes([ck_a, ck_b])

def build_ubx(msg_class, msg_id, payload):
    length = len(payload).to_bytes(2, "little")
    body = bytes([msg_class, msg_id]) + length + payload
    return b"\xB5\x62" + body + ubx_checksum(body)

ser = serial.Serial(PORT, BAUD, timeout=1)

# Enable UBX-NAV-PVT on USB port
# class NAV = 0x01, id PVT = 0x07
# rateUSB = 1
payload = bytes([
    0x01, 0x07,  # message: NAV-PVT
    0x00,        # I2C
    0x00,        # UART1
    0x00,        # UART2
    0x01,        # USB enable
    0x00,        # SPI
    0x00         # reserved
])

cmd = build_ubx(0x06, 0x01, payload)  # UBX-CFG-MSG
ser.write(cmd)

time.sleep(0.5)
print("Đã gửi lệnh bật UBX-NAV-PVT trên USB")

ser.close()