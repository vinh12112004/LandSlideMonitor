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
        // 1. Lấy thông tin Device kèm danh sách Sensor của nó
        var device = await _db.Devices
            .Include(d => d.Sensors)
            .FirstOrDefaultAsync(x => x.DeviceId == dto.DeviceId);

        if (device == null) return null;

        // 2. Lấy toàn bộ Threshold chung (Nên dùng Cache ở đây nếu dự án thực tế)
        var allThresholds = await _db.Thresholds.ToListAsync();

        // 3. Tính toán Status tổng thể và cập nhật trạng thái từng Sensor
        var recordStatus = DataStatus.Normal;
        
        foreach (var sensor in device.Sensors)
        {
            // Thử lấy giá trị từ JSON dựa trên SensorCode (ví dụ: "soil_m")
            if (dto.Data.TryGetProperty(sensor.SensorCode, out var property))
            {
                if (property.ValueKind == JsonValueKind.Null)
                {
                    sensor.Status = SensorStatus.Error; // STM32 gửi null như đã bàn
                    continue;
                }

                double val = property.GetDouble();
                sensor.Status = SensorStatus.Active;

                // Lấy ngưỡng chung cho loại cảm biến này
                var thresholdsForType = allThresholds.Where(t => t.SensorType == sensor.Type);
                
                foreach (var th in thresholdsForType)
                {
                    if (val < th.MinValue || val > th.MaxValue)
                    {
                        // Nếu vượt ngưỡng Alert (2) thì ưu tiên cao nhất
                        if (th.ActionType == DataStatus.Alert) recordStatus = DataStatus.Alert;
                        // Nếu chỉ là Warning (1) và hiện tại chưa bị Alert thì set Warning
                        else if (th.ActionType == DataStatus.Warning && recordStatus != DataStatus.Alert)
                            recordStatus = DataStatus.Warning;
                    }
                }
            }
            else
            {
                sensor.Status = SensorStatus.Missing; // Không có key trong JSON
            }
        }

        // 4. Tạo entity SensorData để lưu vào lịch sử
        var entity = new SensorData
        {
            DeviceId = dto.DeviceId,
            Timestamp = dto.Timestamp,
            // Lưu nguyên cục JSON thô vào DB
            JsonData = dto.Data.GetRawText(), 
            Status = recordStatus
        };

        _db.SensorDatas.Add(entity);
        await _db.SaveChangesAsync(); // Lưu cả SensorStatus và SensorData

        return entity;
    }

    // private DataStatus CalculateStatus(SensorDataDto dto)
    // {
    //     if (dto.SoilMoisture > 40 && (dto.Accel?.X ?? 0) > 0.3)
    //         return DataStatus.Alert;
    //
    //     if (dto.SoilMoisture > 25)
    //         return DataStatus.Warning;
    //
    //     return DataStatus.Normal;
    // }
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