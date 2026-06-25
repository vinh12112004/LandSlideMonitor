namespace LandslideMonitor.Models;

public class UserProvince : IAuditable
{
    public int UserId { get; set; }
    public User User { get; set; }

    public int ProvinceId { get; set; }
    public Province Province { get; set; }
}