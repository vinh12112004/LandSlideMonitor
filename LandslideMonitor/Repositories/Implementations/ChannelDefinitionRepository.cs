using LandslideMonitor.Data;
using LandslideMonitor.Models;
using LandslideMonitor.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace LandslideMonitor.Repositories.Implementations;

public class ChannelDefinitionRepository : IChannelDefinitionRepository
{
    private readonly AppDbContext _db;

    public ChannelDefinitionRepository(AppDbContext db)
    {
        _db = db;
    }

    public async Task<IEnumerable<ChannelDefinition>> GetAllAsync()
    {
        return await _db.SensorTypes.ToListAsync();
    }

    public async Task<ChannelDefinition?> GetByIdAsync(int id)
    {
        return await _db.SensorTypes.FindAsync(id);
    }

    public async Task AddAsync(ChannelDefinition sensorType)
    {
        await _db.SensorTypes.AddAsync(sensorType);
    }

    public Task UpdateAsync(ChannelDefinition sensorType)
    {
        _db.SensorTypes.Update(sensorType);
        return Task.CompletedTask;
    }

    public Task DeleteAsync(ChannelDefinition sensorType)
    {
        _db.SensorTypes.Remove(sensorType);
        return Task.CompletedTask;
    }

    public async Task<bool> ExistsByNameAsync(string name)
    {
        return await _db.SensorTypes.AnyAsync(x => x.Name == name);
    }

    public async Task<bool> ExistsByDataKeyAsync(string dataKey)
    {
        return await _db.SensorTypes.AnyAsync(x => x.DataKey == dataKey);
    }

    public async Task SaveChangesAsync()
    {
        await _db.SaveChangesAsync();
    }
}