namespace LandslideMonitor.Models;

public class Threshold
{
    public int Id { get; set; }
    public int channelDefinitionid { get; set; }
    public ChannelDefinition channelDefinition { get; set; }

    public byte Level { get; set; } // 1 Warning, 2 Danger
    public double ThresholdValue { get; set; }
    public string Note { get; set; }
}