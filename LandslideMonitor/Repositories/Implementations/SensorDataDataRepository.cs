using LandslideMonitor.Data;
using LandslideMonitor.Models;
using LandslideMonitor.Repositories.Interfaces;

namespace LandslideMonitor.Repositories.Implementations;

using Microsoft.EntityFrameworkCore;

public class SensorDataDataRepository : ISensorDataRepository
{
    private readonly AppDbContext _db;

    public SensorDataDataRepository(AppDbContext db)
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
}