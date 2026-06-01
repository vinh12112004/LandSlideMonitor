using System.Text.Json;
using LandslideMonitor.Data;
using LandslideMonitor.DTOs;
using LandslideMonitor.Helpers;
using LandslideMonitor.Models;
using LandslideMonitor.Repositories.Interfaces;
using LandslideMonitor.Services.Interfaces;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace LandslideMonitor.Services.Implementations;

public class SensorDataService : ISensorDataService
{
    private readonly ISensorDataRepository _sensorDataRepo;
    private readonly AppDbContext _db;
    private readonly IMemoryCache _cache;

    public SensorDataService(ISensorDataRepository sensorDataRepo, AppDbContext db, IMemoryCache cache)
    {
        _sensorDataRepo = sensorDataRepo;
        _db = db;
        _cache = cache;
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

        // 2. Lấy Threshold từ cache vì dữ liệu này ít thay đổi
        var thresholdsByChannel = await GetThresholdsByChannelAsync();

        // 3. Tính recordStatus và cập nhật Sensor.Status
        var recordStatus = DataStatus.Normal;
        var reasons = new List<string>();

        foreach (var sensor in device.Sensors)
        {
            if (sensor.SensorChannels == null || sensor.SensorChannels.Count == 0)
            {
                sensor.Status = SensorStatus.Missing;
                continue;
            }

            var sensorLevel = (byte)0;
            var hasValidChannel = false;

            foreach (var channel in sensor.SensorChannels)
            {
                var dataKey = channel.ChannelDefinition?.DataKey;
                var channelName = channel.ChannelDefinition?.Name ?? dataKey ?? "Unknown";

                if (string.IsNullOrWhiteSpace(dataKey))
                    continue;

                if (!dto.Data.TryGetValue(dataKey, out var valNullable))
                    continue;

                if (valNullable == null)
                {
                    sensor.Status = SensorStatus.Error;
                    continue;
                }

                hasValidChannel = true;

                double val = valNullable.Value;

                var channelLevel = (byte)0;

                if (thresholdsByChannel.TryGetValue(channel.ChannelDefinitionId, out var thresholdsForChannel))
                {
                    foreach (var th in thresholdsForChannel)
                    {
                        if (th.Level == 0) continue;

                        if (val >= th.ThresholdValue && th.Level > channelLevel)
                        {
                            channelLevel = th.Level;
                        }
                    }
                }

                if (channelLevel > sensorLevel)
                {
                    sensorLevel = channelLevel;
                }

                if (channelLevel == 1)
                {
                    reasons.Add($"{channelName} vượt ngưỡng cảnh báo");
                }
                else if (channelLevel >= 2)
                {
                    reasons.Add($"{channelName} vượt ngưỡng báo động");
                }
            }

            sensor.Status = hasValidChannel ? SensorStatus.Active : SensorStatus.Missing;

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
            JsonData = JsonSerializer.Serialize(dto.Data),
            Status = recordStatus,
            AlertReason = reasons.Count > 0 ? string.Join("; ", reasons) : null
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

    public async Task<PagedResult<SensorData>> GetAlertsPagedAsync(SensorQueryParams param)
    {
        var query = _sensorDataRepo.GetQuery();

        if (!string.IsNullOrEmpty(param.DeviceId))
            query = query.Where(x => x.DeviceId.Contains(param.DeviceId));

        if (param.From.HasValue)
            query = query.Where(x => x.Timestamp >= param.From.Value);

        if (param.To.HasValue)
        {
            var nextDay = param.To.Value.Date.AddDays(1);
            query = query.Where(x => x.Timestamp < nextDay);
        }

        query = query.Where(x => x.Status == DataStatus.Warning || x.Status == DataStatus.Alert)
                     .OrderByDescending(x => x.Timestamp);

        return await query.ToPagedResultAsync(param.PageNumber, param.PageSize);
    }

    public async Task<IEnumerable<SensorData>> GetLatestForAllDevicesAsync(int? provinceId = null)
    {
        return await _sensorDataRepo.GetLatestForAllDevicesAsync(provinceId);
    }

    private async Task<Dictionary<int, List<ThresholdCacheItem>>> GetThresholdsByChannelAsync()
    {
        return await _cache.GetOrCreateAsync(CacheKeys.ThresholdsByChannel, async entry =>
        {
            entry.AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(30);
            entry.SlidingExpiration = TimeSpan.FromMinutes(10);

            var thresholds = await _db.Thresholds
                .AsNoTracking()
                .Select(t => new ThresholdCacheItem(
                    t.channelDefinitionid,
                    t.Level,
                    t.ThresholdValue))
                .ToListAsync();

            return thresholds
                .GroupBy(t => t.ChannelDefinitionId)
                .ToDictionary(g => g.Key, g => g.ToList());
        }) ?? new Dictionary<int, List<ThresholdCacheItem>>();
    }

    private sealed record ThresholdCacheItem(
        int ChannelDefinitionId,
        byte Level,
        double ThresholdValue);
}
