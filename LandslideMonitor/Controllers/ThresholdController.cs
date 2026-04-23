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

        public ThresholdController(IThresholdRepository thresholdRepository)
        {
            _thresholdRepository = thresholdRepository;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ThresholdDto>>> GetThresholds()
        {
            var thresholds = await _thresholdRepository.GetThresholdsAsync();
            var thresholdDtos = thresholds.Select(t => new ThresholdDto
            {
                Id = t.Id,
                SensorType = t.SensorType,
                MinValue = t.MinValue,
                MaxValue = t.MaxValue,
                ActionType = t.ActionType
            });
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

            var thresholdDto = new ThresholdDto
            {
                Id = threshold.Id,
                SensorType = threshold.SensorType,
                MinValue = threshold.MinValue,
                MaxValue = threshold.MaxValue,
                ActionType = threshold.ActionType
            };

            return Ok(thresholdDto);
        }

        [HttpPost]
        public async Task<ActionResult<ThresholdDto>> CreateThreshold(CreateThresholdDto createThresholdDto)
        {
            var threshold = new Threshold
            {
                SensorType = createThresholdDto.SensorType,
                MinValue = createThresholdDto.MinValue,
                MaxValue = createThresholdDto.MaxValue,
                ActionType = createThresholdDto.ActionType
            };

            await _thresholdRepository.CreateThresholdAsync(threshold);

            var thresholdDto = new ThresholdDto
            {
                Id = threshold.Id,
                SensorType = threshold.SensorType,
                MinValue = threshold.MinValue,
                MaxValue = threshold.MaxValue,
                ActionType = threshold.ActionType
            };

            return CreatedAtAction(nameof(GetThreshold), new { id = threshold.Id }, thresholdDto);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateThreshold(int id, UpdateThresholdDto updateThresholdDto)
        {
            var threshold = await _thresholdRepository.GetThresholdByIdAsync(id);

            if (threshold == null)
            {
                return NotFound();
            }

            threshold.MinValue = updateThresholdDto.MinValue;
            threshold.MaxValue = updateThresholdDto.MaxValue;
            threshold.ActionType = updateThresholdDto.ActionType;

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