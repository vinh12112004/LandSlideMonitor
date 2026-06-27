using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
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

        // =====================================================================
        // TÍNH TOÁN DỊCH CHUYỂN BƠM VÀO DTO (NHANH & CHẬM)
        // =====================================================================
        
        if (dto.Data.TryGetValue("Lat", out var latValNullable) && 
            dto.Data.TryGetValue("Lon", out var lonValNullable) && 
            latValNullable.HasValue && lonValNullable.HasValue)
        {
            Console.WriteLine($"[DEBUG] DB LastLat: {device.LastLatitude} | Tọa độ mới gửi lên: {latValNullable.Value}");
            double currentLat = latValNullable.Value;
            double currentLon = lonValNullable.Value;

            // -----------------------------------------------------------------
            // A. DỊCH CHUYỂN NHANH (TỨC THỜI): So với bản tin liền kề trước đó
            // Tận dụng LastLatitude và LastLongitude có sẵn trong Device
            // -----------------------------------------------------------------
            if (device.LastLatitude.HasValue && device.LastLongitude.HasValue)
            {
                double fastDistance = CalculateHaversineDistance(
                    device.LastLatitude.Value, 
                    device.LastLongitude.Value, 
                    currentLat, 
                    currentLon);
                
                // Bơm kênh ảo dịch chuyển tức thời
                dto.Data["Displacement_Fast"] = fastDistance; 
            }
            else
            {
                dto.Data["Displacement_Fast"] = 0;
            }

            // -----------------------------------------------------------------
            // B. DỊCH CHUYỂN CHẬM (CREEP): Cửa sổ cố định 0h, 6h, 12h, 18h
            // Sử dụng MemoryCache để không phải Query Database
            // -----------------------------------------------------------------
            string refCacheKey = $"RefLoc_{dto.DeviceId}";

            if (!_cache.TryGetValue(refCacheKey, out DeviceRefLocation refLoc))
            {
                // Khởi tạo mốc ban đầu
                refLoc = new DeviceRefLocation(currentLat, currentLon, dto.Timestamp);
                _cache.Set(refCacheKey, refLoc, new MemoryCacheEntryOptions().SetAbsoluteExpiration(TimeSpan.FromHours(24)));
                
                dto.Data["Displacement_6h"] = 0; 
            }
            else
            {
                // Chia khung giờ thành các block 6 tiếng (0, 1, 2, 3)
                // int currentBlock = dto.Timestamp.Hour / 6;
                // int refBlock = refLoc.Timestamp.Hour / 6;
                int currentBlock = dto.Timestamp.Minute / 2; // Cứ mỗi 2 phút là 1 Block
                int refBlock = refLoc.Timestamp.Minute / 2;
                
                // Nếu khác Block hoặc qua ngày mới -> Tính khoảng cách
                if (currentBlock != refBlock || dto.Timestamp.Date > refLoc.Timestamp.Date)
                {
                    double slowDistance = CalculateHaversineDistance(refLoc.Lat, refLoc.Lon, currentLat, currentLon);
                    
                    dto.Data["Displacement_6h"] = slowDistance;

                    // Cập nhật mốc tọa độ mới vào Cache cho chu kỳ 6h tới
                    var newRefLoc = new DeviceRefLocation(currentLat, currentLon, dto.Timestamp);
                    _cache.Set(refCacheKey, newRefLoc, new MemoryCacheEntryOptions().SetAbsoluteExpiration(TimeSpan.FromHours(24)));
                }
                else
                {
                    dto.Data["Displacement_6h"] = 0;
                }
            }

            // Cập nhật tọa độ mới nhất vào thực thể Device
            
            device.LastLatitude = currentLat;
            device.LastLongitude = currentLon;
        }
        // =====================================================================

        // 2. Lấy Threshold từ cache
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

                if (string.IsNullOrWhiteSpace(dataKey)) continue;
                if (!dto.Data.TryGetValue(dataKey, out var valNullable)) continue;

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

                if (channelLevel > sensorLevel) sensorLevel = channelLevel;

                if (channelLevel == 1) reasons.Add($"{channelName} vượt ngưỡng cảnh báo");
                else if (channelLevel >= 2) reasons.Add($"{channelName} vượt ngưỡng báo động");
            }

            sensor.Status = hasValidChannel ? SensorStatus.Active : SensorStatus.Missing;

            if (sensorLevel >= 2) recordStatus = DataStatus.Alert;
            else if (sensorLevel == 1 && recordStatus != DataStatus.Alert) recordStatus = DataStatus.Warning;
        }

        // =====================================================================
        // BỘ LỌC CHỐNG SPAM CẢNH BÁO (ALERT SUPPRESSION & COOLDOWN)
        // =====================================================================
        bool shouldTriggerNotification = false; 

        if (recordStatus == DataStatus.Warning || recordStatus == DataStatus.Alert)
        {
            string alertCacheKey = $"AlertState_{dto.DeviceId}";

            if (!_cache.TryGetValue(alertCacheKey, out DeviceAlertState lastState))
            {
                // Lần đầu vượt ngưỡng -> Báo ngay
                shouldTriggerNotification = true;
            }
            else
            {
                // Leo thang mức độ nguy hiểm (Ví dụ Warning lên Alert)
                if (recordStatus > lastState.Status)
                {
                    shouldTriggerNotification = true;
                }
                // Giữ nguyên mức độ -> Xét Cooldown (Giới hạn nhắc lại mỗi 60 phút)
                else if ((dto.Timestamp - lastState.LastAlertTime).TotalMinutes >= 60)
                {
                    shouldTriggerNotification = true;
                }
            }

            if (shouldTriggerNotification)
            {
                var newState = new DeviceAlertState(recordStatus, dto.Timestamp);
                _cache.Set(alertCacheKey, newState, new MemoryCacheEntryOptions().SetAbsoluteExpiration(TimeSpan.FromHours(24)));
            }
        }
        else if (recordStatus == DataStatus.Normal)
        {
            // Trở về an toàn -> Xóa trạng thái để lần sau báo ngay
            string alertCacheKey = $"AlertState_{dto.DeviceId}";
            _cache.Remove(alertCacheKey);
        }
        // =====================================================================

        // 4. Lưu SensorData lịch sử vào Database
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

        // 5. KÍCH HOẠT THÔNG BÁO EXTERNAL (Gửi SMS/Push/Websocket)
        if (shouldTriggerNotification)
        {
            // TODO: Bổ sung code gọi Service gửi thông báo thực tế của bạn tại đây
        }

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

    // =====================================================================
    // CÁC HÀM HELPER
    // =====================================================================
    private double CalculateHaversineDistance(double lat1, double lon1, double lat2, double lon2)
    {
        const double R = 6371000.0; // Bán kính Trái Đất (mét)
        
        double lat1Rad = lat1 * Math.PI / 180.0;
        double lon1Rad = lon1 * Math.PI / 180.0;
        double lat2Rad = lat2 * Math.PI / 180.0;
        double lon2Rad = lon2 * Math.PI / 180.0;

        double dLat = lat2Rad - lat1Rad;
        double dLon = lon2Rad - lon1Rad;

        double a = Math.Sin(dLat / 2) * Math.Sin(dLat / 2) +
                   Math.Cos(lat1Rad) * Math.Cos(lat2Rad) *
                   Math.Sin(dLon / 2) * Math.Sin(dLon / 2);
                   
        return R * (2 * Math.Atan2(Math.Sqrt(a), Math.Sqrt(1 - a)));
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

    // =====================================================================
    // CÁC RECORD LƯU TRỮ TRONG CACHE VÀ HELPER
    // =====================================================================
    private sealed record ThresholdCacheItem(
        int ChannelDefinitionId,
        byte Level,
        double ThresholdValue);

    private sealed record DeviceRefLocation(
        double Lat, 
        double Lon, 
        DateTime Timestamp);

    private sealed record DeviceAlertState(
        DataStatus Status, 
        DateTime LastAlertTime);
}