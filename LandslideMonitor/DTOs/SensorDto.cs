using LandslideMonitor.Models;

namespace LandslideMonitor.DTOs
{
    public class CreateSensorDto
    {
        public string DeviceId { get; set; }
        public string Name { get; set; }
        public SensorType Type { get; set; }
        public string SensorCode { get; set; }
    }

    public class UpdateSensorDto
    {
        public string Name { get; set; }
        public SensorStatus Status { get; set; }
    }
    
    public class SensorDto
    {
        public int Id { get; set; }
        public string DeviceId { get; set; }
        public string Name { get; set; }
        public SensorType Type { get; set; }
        public string SensorCode { get; set; }
        public SensorStatus Status { get; set; }
    }
}