namespace LandslideMonitor.Models;

public class Province
{
    public int Id { get; set; }
    public string Name { get; set; }
    public ICollection<Device> Devices { get; set; }
    public List<UserProvince> UserProvinces { get; set; }
}