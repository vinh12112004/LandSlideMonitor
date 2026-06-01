using AutoMapper;
using LandslideMonitor.DTOs;
using LandslideMonitor.Helpers;
using LandslideMonitor.Models;
using LandslideMonitor.Repositories.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;

namespace LandslideMonitor.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ThresholdController : ControllerBase
{
    private readonly IThresholdRepository _thresholdRepository;
    private readonly IMapper _mapper;
    private readonly IMemoryCache _cache;

    public ThresholdController(
        IThresholdRepository thresholdRepository,
        IMapper mapper,
        IMemoryCache cache)
    {
        _thresholdRepository = thresholdRepository;
        _mapper = mapper;
        _cache = cache;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<ThresholdDto>>> GetThresholds()
    {
        var thresholds = await _thresholdRepository.GetThresholdsAsync();

        return Ok(
            _mapper.Map<IEnumerable<ThresholdDto>>(thresholds)
        );
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ThresholdDto>> GetThreshold(int id)
    {
        var threshold = await _thresholdRepository.GetThresholdByIdAsync(id);

        if (threshold == null)
            return NotFound();

        return Ok(
            _mapper.Map<ThresholdDto>(threshold)
        );
    }

    [HttpPost]
    public async Task<ActionResult<ThresholdDto>> CreateThreshold(
        CreateThresholdDto dto)
    {
        var allThresholds = (
            await _thresholdRepository.GetThresholdsAsync()
        ).ToList();

        var validation = ValidateThreshold(
            allThresholds,
            dto.ChannelDefinitionId,
            dto.Level,
            dto.ThresholdValue
        );

        if (validation != null)
            return BadRequest(validation);

        var entity = _mapper.Map<Threshold>(dto);

        await _thresholdRepository.CreateThresholdAsync(entity);

        ClearCache();

        var result = _mapper.Map<ThresholdDto>(entity);

        return CreatedAtAction(
            nameof(GetThreshold),
            new { id = entity.Id },
            result
        );
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateThreshold(
        int id,
        UpdateThresholdDto dto)
    {
        var threshold = await _thresholdRepository
            .GetThresholdByIdAsync(id);

        if (threshold == null)
            return NotFound();

        var allThresholds = (
            await _thresholdRepository.GetThresholdsAsync()
        ).ToList();

        var validation = ValidateThreshold(
            allThresholds,
            threshold.channelDefinitionid,
            dto.Level,
            dto.ThresholdValue,
            id
        );

        if (validation != null)
            return BadRequest(validation);

        _mapper.Map(dto, threshold);

        await _thresholdRepository.UpdateThresholdAsync(
            threshold
        );

        ClearCache();

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteThreshold(
        int id)
    {
        var threshold = await _thresholdRepository
            .GetThresholdByIdAsync(id);

        if (threshold == null)
            return NotFound();

        await _thresholdRepository.DeleteThresholdAsync(
            id
        );

        ClearCache();

        return NoContent();
    }


    // ==============================
    // Private methods
    // ==============================

    private void ClearCache()
    {
        _cache.Remove(
            CacheKeys.ThresholdsByChannel
        );
    }

    private string? ValidateThreshold(
        List<Threshold> thresholds,
        int channelDefinitionId,
        byte level,
        double thresholdValue,
        int? excludeId = null)
    {
        var sameChannel = thresholds
            .Where(x =>
                x.channelDefinitionid == channelDefinitionId &&
                (!excludeId.HasValue ||
                 x.Id != excludeId.Value))
            .ToList();


        // duplicate level
        if (sameChannel.Any(x =>
            x.Level == level))
        {
            return
                "Level đã tồn tại cho channel này.";
        }


        // lower level
        var lowerConflict = sameChannel.Any(x =>
            x.Level < level &&
            x.ThresholdValue >= thresholdValue);


        // higher level
        var higherConflict = sameChannel.Any(x =>
            x.Level > level &&
            x.ThresholdValue <= thresholdValue);


        if (lowerConflict || higherConflict)
        {
            return
                "Threshold không hợp lệ. " +
                "Level cao hơn phải có giá trị ngưỡng lớn hơn level thấp hơn.";
        }

        return null;
    }
}