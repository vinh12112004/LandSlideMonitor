using LandslideMonitor.DTOs;
using LandslideMonitor.Models;
using LandslideMonitor.Repositories.Interfaces;
using LandslideMonitor.Services.Interfaces;

namespace LandslideMonitor.Services.Implementations;

public class DeviceService : IDeviceService
{
    private readonly IDeviceRepository _repo;
    private IDeviceService _deviceServiceImplementation;

    public DeviceService(IDeviceRepository repo)
    {
        _repo = repo;
    }

    public async Task<List<Device>> GetAllAsync()
    {
        return await _repo.GetAllAsync();
    }

    public async Task<Device?> GetByIdAsync(string deviceId)
    {
        return await _repo.GetByIdAsync(deviceId);
    }

    public async Task<Device?> CreateAsync(CreateDeviceDto dto)
    {
        var existing = await _repo.GetByIdAsync(dto.DeviceId);
        if (existing != null)
            return null;

        var device = new Device
        {
            DeviceId = dto.DeviceId,
            Location = dto.Location,
            Status = DeviceStatus.Offline,
            LastSeen = DateTime.UtcNow
        };

        await _repo.AddAsync(device);
        await _repo.SaveChangesAsync();

        return device;
    }

    public async Task<bool> DeleteAsync(string deviceId)
    {
        var device = await _repo.GetByIdAsync(deviceId);
        if (device == null)
            return false;

        await _repo.DeleteAsync(device);
        await _repo.SaveChangesAsync();

        return true;
    }

    public async Task<Device> UpdateStatusAsync(string deviceId, DeviceStatus status, DateTime lastSeen, double? lat, double? lon)
    {
        var device = await _repo.GetByIdAsync(deviceId);
        if (device == null)
            return null;

        var isChanged =
            device.Status != status ||
            device.LastLatitude != lat ||
            device.LastLongitude != lon;

        device.LastSeen = lastSeen;

        if (isChanged)
        {
            device.Status = status;
            device.LastLatitude = lat;
            device.LastLongitude = lon;

            await _repo.SaveChangesAsync();
        }

        return device;
    }

    public async Task<List<Device>> GetOfflineCandidatesAsync(DateTime threshold)
    {
        return await _repo.GetOfflineCandidatesAsync(threshold);
    }
    public async Task<Device?> UpdateAsync(string deviceId, UpdateDeviceDto dto)
    {
        var device = await _repo.GetByIdAsync(deviceId);
        if (device == null)
            return null;

        device.Name = dto.Name;
        device.Location = dto.Location;
        device.Status = dto.Status;

        await _repo.UpdateAsync(device);
        await _repo.SaveChangesAsync();

        return device;
    }
}