using LandslideMonitor.Models;

namespace LandslideMonitor.DTOs
{
    public class CreateSensorDto
    {
        public string DeviceId { get; set; }
        public string Name { get; set; }
        public List<int> ChannelDefinitionIds { get; set; }
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
        public string SensorCode { get; set; }
        public SensorStatus Status { get; set; }
        public List<SensorChannelDto> Channels { get; set; }
    }
    public class SensorChannelDto
    {
        public int Id { get; set; }
        public int ChannelDefinitionId { get; set; }
        public string ChannelName { get; set; }
        public string DataKey { get; set; }
        public string UnitSymbol { get; set; }
    }
}