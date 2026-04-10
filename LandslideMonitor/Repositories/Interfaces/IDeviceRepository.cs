using LandslideMonitor.Models;

namespace LandslideMonitor.Repositories.Interfaces;

public interface IDeviceRepository
{
    Task<List<Device>> GetAllAsync();
    Task<Device?> GetByIdAsync(string deviceId);
    Task AddAsync(Device device);
    Task DeleteAsync(Device device);
    Task SaveChangesAsync();
    Task<List<Device>> GetOfflineCandidatesAsync(DateTime threshold);
}