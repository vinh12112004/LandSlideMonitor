using LandslideMonitor.DTOs;
using LandslideMonitor.Helpers;
using LandslideMonitor.Models;

namespace LandslideMonitor.Repositories.Interfaces;

public interface IDeviceRepository
{
    Task<PagedResult<Device>> GetAllAsync(DeviceFilterParams filterParams);
    Task<Device?> GetByIdAsync(string deviceId, bool? isMqtt =false);
    Task AddAsync(Device device);
    Task UpdateAsync(Device device);
    Task DeleteAsync(Device device);
    Task SaveChangesAsync();
    Task<List<Device>> GetOfflineCandidatesAsync(DateTime threshold);
    bool HasAccessToProvince(int provinceId);
}