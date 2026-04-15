using LandslideMonitor.Models;

namespace LandslideMonitor.DTOs;

public class DeviceDto
{
    public string DeviceId { get; set; }
    public string Name { get; set; }
    public DeviceStatus Status { get; set; }
    public int ProvinceId { get; set; }
    public string ProvinceName { get; set; }
    public DateTime LastSeen { get; set; }
    public double? LastLatitude { get; set; }
    public double? LastLongitude { get; set; }
}
public class CreateDeviceDto
{
    public string DeviceId { get; set; }
    public string Name { get; set; }
    public int ProvinceId { get; set; }
}

public class UpdateDeviceDto
{
    public string Name { get; set; }
    public int ProvinceId { get; set; }
    public DeviceStatus Status { get; set; }
}