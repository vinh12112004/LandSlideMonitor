from serial import Serial
from pyubx2 import UBXReader

stream = Serial('/dev/ttyACM0', 115200, timeout=1)

ubr = UBXReader(stream)

while True:
    raw_data, parsed_data = ubr.read()

    if parsed_data and parsed_data.identity == "NAV-PVT":
        print(parsed_data)