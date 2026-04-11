using LandslideMonitor.Models;

namespace LandslideMonitor.Repositories.Interfaces;

public interface ISensorDataRepository
{
    Task<List<SensorData>> GetLatestAsync(int limit);
    Task AddAsync(SensorData data);
    public IQueryable<SensorData> GetQuery();
}