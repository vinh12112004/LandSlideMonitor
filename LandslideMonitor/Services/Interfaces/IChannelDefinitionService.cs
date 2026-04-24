using LandslideMonitor.DTOs;

namespace LandslideMonitor.Services.Interfaces;

public interface IChannelDefinitionService
{
    Task<IEnumerable<ChannelDefinitionDto>> GetAllAsync();
    Task<ChannelDefinitionDto?> GetByIdAsync(int id);
    Task<ChannelDefinitionDto?> CreateAsync(CreateChannelDefinitionDto dto);
    Task<ChannelDefinitionDto?> UpdateAsync(int id, UpdateChannelDefinitionDto dto);
    Task<bool> DeleteAsync(int id);
}