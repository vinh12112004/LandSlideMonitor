namespace LandslideMonitor.Models;

public class Sensor : IAuditable
{
    public int Id { get; set; }
    public string DeviceId { get; set; }
    public Device Device { get; set; }

    public string Name { get; set; }
    public string SensorCode { get; set; }
    public SensorStatus Status { get; set; }

    public ICollection<SensorChannel> SensorChannels { get; set; }
}
public enum SensorStatus
{
    Inactive = 0,
    Active = 1,
    Error = 2,
    Missing = 3
}
