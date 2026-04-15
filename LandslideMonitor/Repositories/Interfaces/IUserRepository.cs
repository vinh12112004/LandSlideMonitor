using LandslideMonitor.DTOs;
using LandslideMonitor.Helpers;
using LandslideMonitor.Models;

namespace LandslideMonitor.Repositories.Interfaces;

public interface IUserRepository
{
    Task<User?> GetByUsername(string username);
    Task<User?> GetById(int id);
    Task Add(User user);
    Task Update(User user);
    Task<PagedResult<User>> GetUsers(UserFilterParams filterParams);
}