using System.Text.Json;
using LandslideMonitor.Helpers;
using LandslideMonitor.Models;

namespace LandslideMonitor.DTOs;

public class SensorDataDto
{
    public string DeviceId { get; set; }
    public DateTime Timestamp { get; set; }
    public Dictionary<string, double?> Data { get; set; }
    public string? AlertReason  { get; set; }
}

public class AccelDto
{
    public double X { get; set; }
    public double Y { get; set; }
    public double Z { get; set; }
}
public class SensorQueryParams : PaginationParams
{
    public String? DeviceId { get; set; }

    public DataStatus? Status { get; set; }

    public DateTime? From { get; set; }

    public DateTime? To { get; set; }
}