namespace LandslideMonitor.Models;

public class SensorData
{
    public long id { get; set; }
    public string DeviceId { get; set; }
    public DateTime Timestamp { get; set; }
    public double SoilMoisture { get; set; }

    public double AccelX { get; set; }
    public double AccelY { get; set; }
    public double AccelZ { get; set; }

    public double Latitude { get; set; }
    public double Longitude { get; set; }
    public DataStatus Status { get; set; }
}
public enum DataStatus
{
    Normal = 0,
    Warning = 1,
    Alert = 2,
    NoData = 3
}