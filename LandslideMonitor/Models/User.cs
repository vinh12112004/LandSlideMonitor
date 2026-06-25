namespace LandslideMonitor.Models;

public class User : IAuditable
{
    public int Id { get; set; }

    public string Username { get; set; }
    public string PasswordHash { get; set; }

    public string Role { get; set; }

    public List<UserProvince> UserProvinces { get; set; }
}