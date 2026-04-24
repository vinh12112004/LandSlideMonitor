using System.Text.Json;
using LandslideMonitor.Data;
using LandslideMonitor.DTOs;
using LandslideMonitor.Helpers;
using LandslideMonitor.Models;
using LandslideMonitor.Repositories.Interfaces;
using LandslideMonitor.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
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
        // 1. Lấy Device kèm SensorChannels và ChannelDefinition
        var device = await _db.Devices
            .Include(d => d.Sensors)
                .ThenInclude(s => s.SensorChannels)
                    .ThenInclude(sc => sc.ChannelDefinition)
            .FirstOrDefaultAsync(x => x.DeviceId == dto.DeviceId);

        if (device == null) return null;

        // 2. Lấy toàn bộ Threshold
        var allThresholds = await _db.Thresholds.ToListAsync();

        // 3. Tính recordStatus và cập nhật Sensor.Status
        var recordStatus = DataStatus.Normal;

        foreach (var sensor in device.Sensors)
        {
            // Mặc định nếu không thấy kênh hợp lệ
            if (sensor.SensorChannels == null || sensor.SensorChannels.Count == 0)
            {
                sensor.Status = SensorStatus.Missing;
                continue;
            }

            var sensorLevel = (byte)0;

            foreach (var channel in sensor.SensorChannels)
            {
                var dataKey = channel.ChannelDefinition?.DataKey;
                if (string.IsNullOrWhiteSpace(dataKey))
                {
                    sensor.Status = SensorStatus.Missing;
                    continue;
                }

                if (!dto.Data.TryGetProperty(dataKey, out var property))
                {
                    sensor.Status = SensorStatus.Missing;
                    continue;
                }

                if (property.ValueKind == JsonValueKind.Null)
                {
                    sensor.Status = SensorStatus.Error;
                    continue;
                }

                double val = property.GetDouble();
                sensor.Status = SensorStatus.Active;

                var thresholdsForChannel = allThresholds
                    .Where(t => t.channelDefinitionid == channel.ChannelDefinitionId);

                foreach (var th in thresholdsForChannel)
                {
                    if (val >= th.ThresholdValue && th.Level > sensorLevel)
                    {
                        sensorLevel = th.Level;
                    }
                }
            }

            if (sensorLevel >= 2)
                recordStatus = DataStatus.Alert;
            else if (sensorLevel == 1 && recordStatus != DataStatus.Alert)
                recordStatus = DataStatus.Warning;
        }

        // 4. Lưu SensorData
        var entity = new SensorData
        {
            DeviceId = dto.DeviceId,
            Timestamp = dto.Timestamp,
            JsonData = dto.Data.GetRawText(),
            Status = recordStatus
        };

        _db.SensorDatas.Add(entity);
        await _db.SaveChangesAsync();

        return entity;
    }

    public async Task<PagedResult<SensorData>> GetPagedAsync(SensorQueryParams param)
    {
        var query = _sensorDataRepo.GetQuery();

        if (!string.IsNullOrEmpty(param.DeviceId))
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
    public async Task<IEnumerable<SensorData>> GetLatestForAllDevicesAsync(int? provinceId = null)
    {
        return await _sensorDataRepo.GetLatestForAllDevicesAsync(provinceId);
    }
}