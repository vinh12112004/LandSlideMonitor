using LandslideMonitor.DTOs;
using LandslideMonitor.Helpers;
using LandslideMonitor.Repositories.Interfaces;
using LandslideMonitor.Services.Interfaces;

namespace LandslideMonitor.Services.Implementations;

public class UserService : IUserService
{
    private readonly IUserRepository _userRepository;

    public UserService(IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }

    public async Task<PagedResult<UserDto>> GetUsers(UserFilterParams filterParams)
    {
        var users = await _userRepository.GetUsers(filterParams);
        var userDtos = users.Data.Select(u => new UserDto
        {
            Id = u.Id,
            Username = u.Username,
            Role = u.Role,
            ProvinceIds = u.UserProvinces.Select(up => up.ProvinceId).ToList()
        });

        return new PagedResult<UserDto>(userDtos, users.TotalCount, users.CurrentPage, users.PageSize);
    }
}