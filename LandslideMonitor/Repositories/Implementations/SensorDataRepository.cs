using LandslideMonitor.Data;
using LandslideMonitor.Models;
using LandslideMonitor.Repositories.Interfaces;

namespace LandslideMonitor.Repositories.Implementations;

using Microsoft.EntityFrameworkCore;

public class SensorDataRepository : ISensorDataRepository
{
    private readonly AppDbContext _db;

    public SensorDataRepository(AppDbContext db)
    {
        _db = db;
    }

    public async Task<List<SensorData>> GetLatestAsync(int limit)
    {
        return await _db.SensorDatas
            .OrderByDescending(x => x.Timestamp)
            .Take(limit)
            .ToListAsync();
    }

    public async Task AddAsync(SensorData data)
    {
        _db.SensorDatas.Add(data);
        await _db.SaveChangesAsync();
    }
    public IQueryable<SensorData> GetQuery()
    {
        return _db.SensorDatas.AsQueryable();
    }

    public async Task<IEnumerable<SensorData>> GetLatestForAllDevicesAsync(int? provinceId = null)
    {
        var latestTimestampsQuery = _db.SensorDatas
            .GroupBy(s => s.DeviceId)
            .Select(g => new {
                DeviceId = g.Key,
                MaxTimestamp = g.Max(s => s.Timestamp)
            });

        var query = from s in _db.SensorDatas
                    join latest in latestTimestampsQuery
                    on new { s.DeviceId, Timestamp = s.Timestamp } equals new { latest.DeviceId, Timestamp = latest.MaxTimestamp }
                    select s;
        
        if (provinceId.HasValue)
        {
            query = query.Where(s => _db.Devices
                .Any(d => d.DeviceId == s.DeviceId && d.ProvinceId == provinceId.Value));
        }

        return await query.ToListAsync();
    }
}