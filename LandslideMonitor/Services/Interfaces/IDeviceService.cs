using LandslideMonitor.DTOs;
using LandslideMonitor.Helpers;
using LandslideMonitor.Models;

namespace LandslideMonitor.Services.Interfaces;

public interface IDeviceService
{
    Task<PagedResult<DeviceDto>> GetAllAsync(DeviceFilterParams filterParams);
    Task<Device?> GetByIdAsync(string deviceId, bool? isMqtt = false);
    Task<Device?> CreateAsync(CreateDeviceDto dto);
    Task<bool> DeleteAsync(string deviceId);
    Task<Device?> UpdateAsync(string deviceId, UpdateDeviceDto dto);
    Task<Device> UpdateStatusAsync(string deviceId, DeviceStatus status, DateTime lastSeen, double? lat, double? lon);
    Task<List<Device>> GetOfflineCandidatesAsync(DateTime threshold);
}