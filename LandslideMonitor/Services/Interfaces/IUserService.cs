using LandslideMonitor.DTOs;
using LandslideMonitor.Helpers;

namespace LandslideMonitor.Services.Interfaces;

public interface IUserService
{
    Task<PagedResult<UserDto>> GetUsers(UserFilterParams filterParams);
}