using LandslideMonitor.Helpers;

namespace LandslideMonitor.DTOs;

public class UserDTO
{
    
}
public class CreateUserRequest
{
    public string Username { get; set; }
    public string Password { get; set; }

    public string Role { get; set; }

    public List<int> ProvinceIds { get; set; }
}
public class UpdateUserRequest
{
    public string? Username { get; set; }
    public string? Password { get; set; }
    public string? Role { get; set; }
    public List<int>? ProvinceIds { get; set; }
}
public class UserFilterParams : PaginationParams
{
    public string? Username { get; set; }
    public string? Role { get; set; }
    public int? ProvinceId { get; set; }
}

public class UserDto
{
    public int Id { get; set; }
    public string Username { get; set; }
    public string Role { get; set; }
    public List<int> ProvinceIds { get; set; }
}