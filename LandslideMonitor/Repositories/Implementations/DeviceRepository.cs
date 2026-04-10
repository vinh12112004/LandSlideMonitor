using LandslideMonitor.Data;
using LandslideMonitor.Models;
using LandslideMonitor.Repositories.Interfaces;

namespace LandslideMonitor.Repositories.Implementations;

using Microsoft.EntityFrameworkCore;

public class DeviceRepository : IDeviceRepository
{
    private readonly AppDbContext _db;

    public DeviceRepository(AppDbContext db)
    {
        _db = db;
    }

    public async Task<List<Device>> GetAllAsync()
    {
        return await _db.Devices.ToListAsync();
    }

    public async Task<Device?> GetByIdAsync(string deviceId)
    {
        return await _db.Devices.FindAsync(deviceId);
    }

    public async Task AddAsync(Device device)
    {
        await _db.Devices.AddAsync(device);
    }

    public async Task DeleteAsync(Device device)
    {
        _db.Devices.Remove(device);
    }

    public async Task SaveChangesAsync()
    {
        await _db.SaveChangesAsync();
    }

    public async Task<List<Device>> GetOfflineCandidatesAsync(DateTime threshold)
    {
        return await _db.Devices
            .Where(d => d.LastSeen < threshold && d.Status != DeviceStatus.Offline)
            .ToListAsync();
    }
}