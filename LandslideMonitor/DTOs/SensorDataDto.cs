using LandslideMonitor.Helpers;
using LandslideMonitor.Models;

namespace LandslideMonitor.DTOs;

public class SensorDataDto
{
    public string DeviceId { get; set; }
    public DateTime Timestamp { get; set; }
    public double SoilMoisture { get; set; }

    public AccelDto Accel { get; set; }
    public GpsDto Gps { get; set; }
}

public class AccelDto
{
    public double X { get; set; }
    public double Y { get; set; }
    public double Z { get; set; }
}

public class GpsDto
{
    public double Lat { get; set; }
    public double Lon { get; set; }
}
public class SensorQueryParams : PaginationParams
{
    public String? DeviceId { get; set; }

    public DataStatus? Status { get; set; }

    public DateTime? From { get; set; }

    public DateTime? To { get; set; }
}