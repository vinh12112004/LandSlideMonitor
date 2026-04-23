using LandslideMonitor.Models;

namespace LandslideMonitor.DTOs
{
    public class CreateThresholdDto
    {
        public SensorType SensorType { get; set; }
        public double MinValue { get; set; }
        public double MaxValue { get; set; }
        public DataStatus ActionType { get; set; }
    }

    public class UpdateThresholdDto
    {
        public double MinValue { get; set; }
        public double MaxValue { get; set; }
        public DataStatus ActionType { get; set; }
    }

    public class ThresholdDto
    {
        public int Id { get; set; }
        public SensorType SensorType { get; set; }
        public double MinValue { get; set; }
        public double MaxValue { get; set; }
        public DataStatus ActionType { get; set; }
    }
}