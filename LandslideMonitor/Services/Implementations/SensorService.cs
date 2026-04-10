using LandslideMonitor.Data;
using LandslideMonitor.DTOs;
using LandslideMonitor.Models;
using LandslideMonitor.Repositories.Interfaces;
using LandslideMonitor.Services.Interfaces;

namespace LandslideMonitor.Services.Implementations;

public class SensorService : ISensorService
{
    private readonly ISensorRepository _sensorRepo;
    private readonly AppDbContext _db;

    public SensorService(ISensorRepository sensorRepo, AppDbContext db)
    {
        _sensorRepo = sensorRepo;
        _db = db;
    }

    public async Task<List<SensorData>> GetLatestAsync(int limit)
    {
        return await _sensorRepo.GetLatestAsync(limit);
    }

    public async Task<SensorData> ProcessSensorDataAsync(SensorDataDto dto)
    {
        var device = await _db.Devices.FindAsync(dto.DeviceId);
        if (device == null)
            return null;

        // update device
        device.Status = DeviceStatus.Online;
        device.LastSeen = dto.Timestamp;
        device.LastLatitude = dto.Gps?.Lat;
        device.LastLongitude = dto.Gps?.Lon;

        var entity = new SensorData
        {
            DeviceId = dto.DeviceId,
            Timestamp = dto.Timestamp,
            SoilMoisture = dto.SoilMoisture,
            AccelX = dto.Accel?.X ?? 0,
            AccelY = dto.Accel?.Y ?? 0,
            AccelZ = dto.Accel?.Z ?? 0,
            Latitude = dto.Gps?.Lat ?? 0,
            Longitude = dto.Gps?.Lon ?? 0,
            Status = CalculateStatus(dto)
        };

        await _sensorRepo.AddAsync(entity);

        return entity;
    }

    private DataStatus CalculateStatus(SensorDataDto dto)
    {
        if (dto.SoilMoisture > 40 && (dto.Accel?.X ?? 0) > 0.3)
            return DataStatus.Alert;

        if (dto.SoilMoisture > 25)
            return DataStatus.Warning;

        return DataStatus.Normal;
    }
}