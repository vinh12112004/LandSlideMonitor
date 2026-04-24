using LandslideMonitor.Models;

namespace LandslideMonitor.Repositories.Interfaces;

public interface IChannelDefinitionRepository
{
    Task<IEnumerable<ChannelDefinition>> GetAllAsync();
    Task<ChannelDefinition?> GetByIdAsync(int id);
    Task AddAsync(ChannelDefinition sensorType);
    Task UpdateAsync(ChannelDefinition sensorType);
    Task DeleteAsync(ChannelDefinition sensorType);
    Task<bool> ExistsByNameAsync(string name);
    Task<bool> ExistsByDataKeyAsync(string dataKey);
    Task SaveChangesAsync();
}