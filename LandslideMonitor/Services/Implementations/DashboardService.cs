using System.Security.Claims;
using LandslideMonitor.Data;
using LandslideMonitor.DTOs;
using LandslideMonitor.Models;
using LandslideMonitor.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace LandslideMonitor.Services.Implementations;

public class DashboardService : IDashboardService
{
    private readonly AppDbContext _db;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public DashboardService(
        AppDbContext db,
        IHttpContextAccessor httpContextAccessor)
    {
        _db = db;
        _httpContextAccessor = httpContextAccessor;
    }

    public async Task<DashboardSummaryDto> GetSummaryAsync()
    {
        var user = _httpContextAccessor.HttpContext?.User;

        if (user == null)
        {
            throw new UnauthorizedAccessException("Chưa đăng nhập");
        }

        var role = user.FindFirstValue(ClaimTypes.Role);
        var provinceIds = GetProvinceIds(user);

        var deviceQuery = _db.Devices
            .AsNoTracking()
            .Include(d => d.Province)
            .AsQueryable();

        if (role == "Manager")
        {
            if (provinceIds.Count == 0)
            {
                return new DashboardSummaryDto
                {
                    ScopeName = "Không có tỉnh được phân quyền"
                };
            }

            deviceQuery = deviceQuery
                .Where(d => provinceIds.Contains(d.ProvinceId));
        }
        else if (role != "Admin")
        {
            throw new UnauthorizedAccessException("Không có quyền truy cập dashboard");
        }

        var totalDevices = await deviceQuery.CountAsync();

        var onlineDevices = await deviceQuery
            .CountAsync(d => d.Status == DeviceStatus.Online);

        var offlineDevices = await deviceQuery
            .CountAsync(d => d.Status == DeviceStatus.Offline);

        var maintenanceDevices = await deviceQuery
            .CountAsync(d => d.Status == DeviceStatus.Maintenance);
        var scopedDeviceIdsQuery = deviceQuery
            .Select(d => d.DeviceId);

        var latestSensorDataQuery =
            from sd in _db.SensorDatas.AsNoTracking()
            where scopedDeviceIdsQuery.Contains(sd.DeviceId)
            where sd.Timestamp == _db.SensorDatas
                .Where(x => x.DeviceId == sd.DeviceId)
                .Max(x => x.Timestamp)
            select sd;

        var normalDevices = await latestSensorDataQuery
            .CountAsync(sd => sd != null && sd.Status == DataStatus.Normal);

        var warningDevices = await latestSensorDataQuery
            .CountAsync(sd => sd != null && sd.Status == DataStatus.Warning);

        var alertDevices = await latestSensorDataQuery
            .CountAsync(sd => sd != null && sd.Status == DataStatus.Alert);
        
        var recentAlerts = await (
                from sd in _db.SensorDatas.AsNoTracking()
                join d in _db.Devices.AsNoTracking().Include(d => d.Province)
                    on sd.DeviceId equals d.DeviceId
                where scopedDeviceIdsQuery.Contains(sd.DeviceId)
                      && (sd.Status == DataStatus.Warning || sd.Status == DataStatus.Alert)
                orderby sd.Timestamp descending
                select new RecentAlertDto
                {
                    Id = sd.id,
                    DeviceId = sd.DeviceId,
                    DeviceName = d.Name,
                    ProvinceName = d.Province.Name,
                    Status = sd.Status,
                    AlertReason = sd.AlertReason,
                    Timestamp = sd.Timestamp
                }
            )
            .Take(5)
            .ToListAsync();
        var scopeName = await GetScopeNameAsync(role, provinceIds);
        return new DashboardSummaryDto
        {
            ScopeName = scopeName,

            TotalDevices = totalDevices,
            OnlineDevices = onlineDevices,
            OfflineDevices = offlineDevices,
            MaintenanceDevices = maintenanceDevices,

            NormalDevices = normalDevices,
            WarningDevices = warningDevices,
            AlertDevices = alertDevices,

            RecentAlerts = recentAlerts
        };
    }

    private static List<int> GetProvinceIds(ClaimsPrincipal user)
    {
        var provincesClaim = user.FindFirstValue("provinces");

        if (string.IsNullOrWhiteSpace(provincesClaim))
        {
            return [];
        }

        return provincesClaim
            .Split(',', StringSplitOptions.RemoveEmptyEntries)
            .Select(value => int.TryParse(value, out var id) ? id : (int?)null)
            .Where(id => id.HasValue)
            .Select(id => id!.Value)
            .Distinct()
            .ToList();
    }
    private async Task<string> GetScopeNameAsync(string? role, List<int> provinceIds)
    {
        if (role == "Admin")
        {
            return "Toàn hệ thống";
        }

        if (provinceIds.Count == 0)
        {
            return "Không có tỉnh được phân quyền";
        }

        if (provinceIds.Count == 1)
        {
            var provinceName = await _db.Provinces
                .AsNoTracking()
                .Where(p => p.Id == provinceIds[0])
                .Select(p => p.Name)
                .FirstOrDefaultAsync();

            return provinceName ?? "1 tỉnh được phân quyền";
        }

        return $"{provinceIds.Count} tỉnh được phân quyền";
    }
}