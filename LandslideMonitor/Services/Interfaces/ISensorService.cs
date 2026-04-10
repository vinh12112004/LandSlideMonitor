using LandslideMonitor.DTOs;
using LandslideMonitor.Models;

namespace LandslideMonitor.Services.Interfaces;

public interface ISensorService
{
    Task<List<SensorData>> GetLatestAsync(int limit);
    Task<SensorData> ProcessSensorDataAsync(SensorDataDto dto);
}