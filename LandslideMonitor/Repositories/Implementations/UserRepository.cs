using LandslideMonitor.Data;
using LandslideMonitor.DTOs;
using LandslideMonitor.Helpers;
using LandslideMonitor.Models;
using LandslideMonitor.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace LandslideMonitor.Repositories.Implementations;

public class UserRepository : IUserRepository
{
    private readonly AppDbContext _context;

    public UserRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<User?> GetByUsername(string username)
    {
        return await _context.Users
            .Include(x => x.UserProvinces)
            .FirstOrDefaultAsync(x => x.Username == username);
    }

    public async Task<User?> GetById(int id)
    {
        return await _context.Users
            .Include(x => x.UserProvinces)
            .FirstOrDefaultAsync(x => x.Id == id);
    }

    public async Task Add(User user)
    {
        _context.Users.Add(user);
        await _context.SaveChangesAsync();
    }
    public async Task Update(User user)
    {
        _context.Users.Update(user);
        await _context.SaveChangesAsync();
    }
    public async Task<PagedResult<User>> GetUsers(UserFilterParams filterParams)
    {
        var query = _context.Users
            .Include(u => u.UserProvinces)
            .AsQueryable();

        if (!string.IsNullOrEmpty(filterParams.Username))
        {
            query = query.Where(u => u.Username.Contains(filterParams.Username));
        }

        if (!string.IsNullOrEmpty(filterParams.Role))
        {
            query = query.Where(u => u.Role == filterParams.Role);
        }

        if (filterParams.ProvinceId.HasValue)
        {
            query = query.Where(u => u.UserProvinces.Any(up => up.ProvinceId == filterParams.ProvinceId.Value));
        }

        return await query.ToPagedResultAsync(filterParams.PageNumber, filterParams.PageSize);
    }
}