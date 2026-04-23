using LandslideMonitor.DTOs;
using LandslideMonitor.Helpers;
using LandslideMonitor.Models;

namespace LandslideMonitor.Services.Interfaces;

public interface IDeviceService
{
    Task<PagedResult<DeviceDto>> GetAllAsync(DeviceFilterParams filterParams);
    Task<DeviceDto?> GetByIdAsync(string deviceId, bool? isMqtt = false);
    Task<DeviceDto?> CreateAsync(CreateDeviceDto dto);
    Task<bool> DeleteAsync(string deviceId);
    Task<DeviceDto?> UpdateAsync(string deviceId, UpdateDeviceDto dto);
    Task<DeviceDto> UpdateStatusAsync(string deviceId, DeviceStatus status, DateTime lastSeen, double? lat, double? lon);
    Task<List<Device>> GetOfflineCandidatesAsync(DateTime threshold);
}