using LandslideMonitor.Models;

namespace LandslideMonitor.DTOs
{
    public class CreateThresholdDto
    {
        public int ChannelDefinitionId { get; set; }
        public byte Level { get; set; }
        public double ThresholdValue { get; set; }
        public string Note { get; set; }
    }

    public class UpdateThresholdDto
    {
        public byte Level { get; set; }
        public double ThresholdValue { get; set; }
        public string Note { get; set; }
    }

    public class ThresholdDto
    {
        public int Id { get; set; }
        public int ChannelDefinitionId { get; set; }
        public byte Level { get; set; }
        public double ThresholdValue { get; set; }
        public string Comparison { get; set; }
        public string Note { get; set; }

        public string ChannelName { get; set; }
        public string DataKey { get; set; }
        public string UnitSymbol { get; set; }
    }
}