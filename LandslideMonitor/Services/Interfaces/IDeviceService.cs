using LandslideMonitor.DTOs;
using LandslideMonitor.Models;

namespace LandslideMonitor.Services.Interfaces;

public interface IDeviceService
{
    Task<List<Device>> GetAllAsync();
    Task<Device?> GetByIdAsync(string deviceId);
    Task<Device?> CreateAsync(CreateDeviceDto dto);
    Task<bool> DeleteAsync(string deviceId);
    Task<Device?> UpdateAsync(string deviceId, UpdateDeviceDto dto);
    Task<Device> UpdateStatusAsync(string deviceId, DeviceStatus status, DateTime lastSeen, double? lat, double? lon);
    Task<List<Device>> GetOfflineCandidatesAsync(DateTime threshold);
}