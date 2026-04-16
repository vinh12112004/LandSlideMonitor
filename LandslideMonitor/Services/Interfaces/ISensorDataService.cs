using LandslideMonitor.DTOs;
using LandslideMonitor.Helpers;
using LandslideMonitor.Models;

namespace LandslideMonitor.Services.Interfaces;

public interface ISensorDataService
{
    Task<List<SensorData>> GetLatestAsync(int limit);
    Task<SensorData> ProcessSensorDataAsync(SensorDataDto dto);
    Task<PagedResult<SensorData>> GetPagedAsync(SensorQueryParams param);
    Task<IEnumerable<SensorData>> GetLatestForAllDevicesAsync(int? provinceId = null);
}