namespace LandslideMonitor.Models;

public class SensorData
{
    public long id { get; set; }
    public string DeviceId { get; set; }
    public DateTime Timestamp { get; set; }
    public string JsonData { get; set; }
    public DataStatus Status { get; set; }
    public string? AlertReason  { get; set; }
}
public enum DataStatus
{
    Normal = 0,
    Warning = 1,
    Alert = 2,
}