namespace LandslideMonitor.Models;

public enum DeviceStatus
{
    Offline = 0,
    Online = 1,
    LowBattery = 2,
    Maintenance =3,
}

public class Device
{
    public string DeviceId { get; set; }
    public string Name { get; set; }

    public DeviceStatus Status { get; set; }
    public int ProvinceId { get; set; }
    public Province Province { get; set; }
    public DateTime LastSeen { get; set; }
    public ICollection<Sensor> Sensors { get; set; }
    public double? LastLatitude { get; set; }
    public double? LastLongitude { get; set; }
}