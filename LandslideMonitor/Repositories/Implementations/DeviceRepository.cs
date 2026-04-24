using System.Security.Claims;
using LandslideMonitor.Data;
using LandslideMonitor.DTOs;
using LandslideMonitor.Helpers;
using LandslideMonitor.Models;
using LandslideMonitor.Repositories.Interfaces;

namespace LandslideMonitor.Repositories.Implementations;

using Microsoft.EntityFrameworkCore;

public class DeviceRepository : IDeviceRepository
{
    private readonly AppDbContext _db;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public DeviceRepository(AppDbContext db, IHttpContextAccessor httpContextAccessor)
    {
        _db = db;
        _httpContextAccessor = httpContextAccessor;
    }

    public async Task<PagedResult<Device>> GetAllAsync(DeviceFilterParams filterParams)
    {
        var query = _db.Devices
            .Include(d => d.Province)
            .Include(d => d.Sensors)
            .AsQueryable();
        var user = _httpContextAccessor.HttpContext?.User;
        if (user != null)
        {
            var role = user.FindFirstValue(ClaimTypes.Role);
            if (role == "Manager")
            {
                var provincesClaim = user.FindFirstValue("provinces");
                if (!string.IsNullOrEmpty(provincesClaim) && provincesClaim != ",")
                {
                    var userProvinceIds = provincesClaim.Split(',')
                        .Select(int.Parse)
                        .ToList();
                    
                    query = query.Where(d => userProvinceIds.Contains(d.ProvinceId));
                }
                else
                {
                    return new PagedResult<Device>(new List<Device>(), 0, filterParams.PageNumber, filterParams.PageSize);
                }
            }
        }
        if (!string.IsNullOrEmpty(filterParams.SearchTerm))
        {
            var searchTermLower = filterParams.SearchTerm.ToLower();
            query = query.Where(d =>
                d.Name.ToLower().Contains(searchTermLower) ||
                d.DeviceId.ToLower().Contains(searchTermLower));
        }

        if (filterParams.ProvinceId.HasValue)
        {
            query = query.Where(d => d.ProvinceId == filterParams.ProvinceId.Value);
        }

        if (filterParams.Status.HasValue)
        {
            query = query.Where(d => d.Status == filterParams.Status.Value);
        }

        return await query.ToPagedResultAsync(filterParams.PageNumber, filterParams.PageSize);
    }

    public async Task<Device?> GetByIdAsync(string deviceId, bool? isMqtt =false)
    {
        var device = await _db.Devices
            .Include(d => d.Province)
            .Include(d => d.Sensors)
            .FirstOrDefaultAsync(d => d.DeviceId == deviceId);

        if (device == null) return null;

        if (HasAccessToProvince(device.ProvinceId) || isMqtt == true)
            return device;

        return null;
    }

    public async Task AddAsync(Device device)
    {
        await _db.Devices.AddAsync(device);
    }

    public Task UpdateAsync(Device device)
    {
        if (!HasAccessToProvince(device.ProvinceId))
            throw new UnauthorizedAccessException("Không có quyền");

        _db.Devices.Update(device);
        return Task.CompletedTask;
    }

    public async Task DeleteAsync(Device device)
    {
        if (!HasAccessToProvince(device.ProvinceId))
            throw new UnauthorizedAccessException("Không có quyền");

        _db.Devices.Remove(device);
    }

    public async Task SaveChangesAsync()
    {
        await _db.SaveChangesAsync();
    }

    public async Task<List<Device>> GetOfflineCandidatesAsync(DateTime threshold)
    {
        return await _db.Devices
            .Where(d => d.LastSeen < threshold && d.Status != DeviceStatus.Offline && d.Status !=DeviceStatus.Maintenance)
            .ToListAsync();
    }
    public bool HasAccessToProvince(int provinceId)
    {
        var user = _httpContextAccessor.HttpContext?.User;
        if (user == null) return false;

        var role = user.FindFirstValue(ClaimTypes.Role);

        if (role == "Admin") return true;

        if (role == "Manager")
        {
            var provincesClaim = user.FindFirstValue("provinces");

            if (string.IsNullOrEmpty(provincesClaim))
                return false;

            var userProvinceIds = provincesClaim.Split(',')
                .Select(int.Parse)
                .ToList();

            return userProvinceIds.Contains(provinceId);
        }

        return false;
    }
}