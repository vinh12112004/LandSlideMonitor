namespace LandslideMonitor.DTOs
{
    public class CreateChannelDefinitionDto
    {
        public string Name { get; set; }
        public string DataKey { get; set; }
        public string UnitSymbol { get; set; }
    }

    public class UpdateChannelDefinitionDto
    {
        public string Name { get; set; }
        public string DataKey { get; set; }
        public string UnitSymbol { get; set; }
    }

    public class ChannelDefinitionDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string DataKey { get; set; }
        public string UnitSymbol { get; set; }
    }
}