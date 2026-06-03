from serial import Serial
from pyubx2 import UBXReader, UBX_PROTOCOL, NMEA_PROTOCOL

stream = Serial("/dev/ttyACM0", 38400, timeout=1)

ubr = UBXReader(
    stream,
    protfilter=UBX_PROTOCOL | NMEA_PROTOCOL
)

print("Đang đọc NMEA mặc định... Ctrl+C để dừng")

try:
    while True:
        raw_data, parsed_data = ubr.read()

        if parsed_data is None:
            continue

        print("=" * 60)

        # raw NMEA
        print(raw_data)

        # parsed object
        print(parsed_data)

except KeyboardInterrupt:
    print("\nĐã dừng")

finally:
    stream.close()