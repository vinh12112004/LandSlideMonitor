using AutoMapper;
using LandslideMonitor.DTOs;
using LandslideMonitor.Models;
using LandslideMonitor.Repositories.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LandslideMonitor.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ThresholdController : ControllerBase
    {
        private readonly IThresholdRepository _thresholdRepository;
        private readonly IMapper _mapper;

        public ThresholdController(IThresholdRepository thresholdRepository, IMapper mapper)
        {
            _thresholdRepository = thresholdRepository;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ThresholdDto>>> GetThresholds()
        {
            var thresholds = await _thresholdRepository.GetThresholdsAsync();
            var thresholdDtos = _mapper.Map<IEnumerable<ThresholdDto>>(thresholds);
            return Ok(thresholdDtos);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ThresholdDto>> GetThreshold(int id)
        {
            var threshold = await _thresholdRepository.GetThresholdByIdAsync(id);
            if (threshold == null)
            {
                return NotFound();
            }

            var dto = _mapper.Map<ThresholdDto>(threshold);
            return Ok(dto);
        }

        [HttpPost]
        public async Task<ActionResult<ThresholdDto>> CreateThreshold(CreateThresholdDto dto)
        {
            var existing = await _thresholdRepository.GetThresholdsAsync();
            var duplicate = existing.Any(t =>
                t.channelDefinitionid == dto.ChannelDefinitionId &&
                t.Level == dto.Level);

            if (duplicate)
            {
                return BadRequest("Level already exists for this ChannelDefinitionId.");
            }

            var threshold = _mapper.Map<Threshold>(dto);

            await _thresholdRepository.CreateThresholdAsync(threshold);

            var resultDto = _mapper.Map<ThresholdDto>(threshold);
            return CreatedAtAction(nameof(GetThreshold), new { id = threshold.Id }, resultDto);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateThreshold(int id, UpdateThresholdDto dto)
        {
            var threshold = await _thresholdRepository.GetThresholdByIdAsync(id);
            if (threshold == null)
            {
                return NotFound();
            }

            var existing = await _thresholdRepository.GetThresholdsAsync();
            var duplicate = existing.Any(t =>
                t.Id != id &&
                t.channelDefinitionid == threshold.channelDefinitionid &&
                t.Level == dto.Level);

            if (duplicate)
            {
                return BadRequest("Level already exists for this ChannelDefinitionId.");
            }

            _mapper.Map(dto, threshold);

            await _thresholdRepository.UpdateThresholdAsync(threshold);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteThreshold(int id)
        {
            var threshold = await _thresholdRepository.GetThresholdByIdAsync(id);
            if (threshold == null)
            {
                return NotFound();
            }

            await _thresholdRepository.DeleteThresholdAsync(id);
            return NoContent();
        }
    }
}