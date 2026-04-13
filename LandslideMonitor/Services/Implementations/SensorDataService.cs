using LandslideMonitor.Data;
using LandslideMonitor.DTOs;
using LandslideMonitor.Helpers;
using LandslideMonitor.Models;
using LandslideMonitor.Repositories.Interfaces;
using LandslideMonitor.Services.Interfaces;
using Microsoft.IdentityModel.Tokens;

namespace LandslideMonitor.Services.Implementations;

public class SensorDataService : ISensorDataService
{
    private readonly ISensorDataRepository _sensorDataRepo;
    private readonly AppDbContext _db;

    public SensorDataService(ISensorDataRepository sensorDataRepo, AppDbContext db)
    {
        _sensorDataRepo = sensorDataRepo;
        _db = db;
    }

    public async Task<List<SensorData>> GetLatestAsync(int limit)
    {
        return await _sensorDataRepo.GetLatestAsync(limit);
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

        await _sensorDataRepo.AddAsync(entity);

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
    public async Task<PagedResult<SensorData>> GetPagedAsync(SensorQueryParams param)
    {
        var query = _sensorDataRepo.GetQuery();

        if (!param.DeviceId.IsNullOrEmpty())
            query = query.Where(x =>  x.DeviceId.Contains(param.DeviceId));

        if (param.Status.HasValue)
            query = query.Where(x => x.Status == param.Status.Value);

        if (param.From.HasValue)
            query = query.Where(x => x.Timestamp >= param.From.Value);

        if (param.To.HasValue)
        {
            var nextDay = param.To.Value.Date.AddDays(1);
            query = query.Where(x => x.Timestamp < nextDay);
        }

        query = query.OrderByDescending(x => x.Timestamp);

        return await query.ToPagedResultAsync(param.PageNumber, param.PageSize);
    }
    public async Task<IEnumerable<SensorData>> GetLatestForAllDevicesAsync()
    {
        return await _sensorDataRepo.GetLatestForAllDevicesAsync();
    }
}