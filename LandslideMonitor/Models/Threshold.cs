namespace LandslideMonitor.Models;

public class Threshold
{
    public int Id { get; set; }

    public SensorType SensorType { get; set; }

    public double MinValue { get; set; }
    public double MaxValue { get; set; }

    public DataStatus ActionType { get; set; } 
}