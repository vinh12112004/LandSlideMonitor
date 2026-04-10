using LandslideMonitor.Models;

namespace LandslideMonitor.Repositories.Interfaces;

public interface ISensorRepository
{
    Task<List<SensorData>> GetLatestAsync(int limit);
    Task AddAsync(SensorData data);
}