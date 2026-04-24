using AutoMapper;
using LandslideMonitor.DTOs;
using LandslideMonitor.Models;
using LandslideMonitor.Repositories.Interfaces;
using LandslideMonitor.Services.Interfaces;

namespace LandslideMonitor.Services.Implementations;

public class ChannelDefinitionService : IChannelDefinitionService
{
    private readonly IChannelDefinitionRepository _repo;
    private readonly IMapper _mapper;

    public ChannelDefinitionService(IChannelDefinitionRepository repo, IMapper mapper)
    {
        _repo = repo;
        _mapper = mapper;
    }

    public async Task<IEnumerable<ChannelDefinitionDto>> GetAllAsync()
    {
        var items = await _repo.GetAllAsync();
        return _mapper.Map<IEnumerable<ChannelDefinitionDto>>(items);
    }

    public async Task<ChannelDefinitionDto?> GetByIdAsync(int id)
    {
        var item = await _repo.GetByIdAsync(id);
        if (item == null) return null;

        return _mapper.Map<ChannelDefinitionDto>(item);
    }

    public async Task<ChannelDefinitionDto?> CreateAsync(CreateChannelDefinitionDto dto)
    {
        if (await _repo.ExistsByNameAsync(dto.Name) || await _repo.ExistsByDataKeyAsync(dto.DataKey))
            return null;

        var entity = _mapper.Map<ChannelDefinition>(dto);

        await _repo.AddAsync(entity);
        await _repo.SaveChangesAsync();

        return _mapper.Map<ChannelDefinitionDto>(entity);
    }

    public async Task<ChannelDefinitionDto?> UpdateAsync(int id, UpdateChannelDefinitionDto dto)
    {
        var entity = await _repo.GetByIdAsync(id);
        if (entity == null) return null;

        entity.Name = dto.Name;
        entity.DataKey = dto.DataKey;
        entity.UnitSymbol = dto.UnitSymbol;

        await _repo.UpdateAsync(entity);
        await _repo.SaveChangesAsync();

        return _mapper.Map<ChannelDefinitionDto>(entity);
        ;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var entity = await _repo.GetByIdAsync(id);
        if (entity == null) return false;

        await _repo.DeleteAsync(entity);
        await _repo.SaveChangesAsync();
        return true;
    }
}