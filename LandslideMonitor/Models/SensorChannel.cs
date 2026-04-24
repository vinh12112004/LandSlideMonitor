namespace LandslideMonitor.Models;

public class SensorChannel
{
    public int Id { get; set; }
    public int SensorId { get; set; }
    public Sensor Sensor { get; set; }

    public int ChannelDefinitionId { get; set; }
    public ChannelDefinition ChannelDefinition { get; set; }
}