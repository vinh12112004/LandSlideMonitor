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
    public class SensorController : ControllerBase
    {
        private readonly ISensorRepository _sensorRepository;
        private readonly IMapper _mapper;

        public SensorController(ISensorRepository sensorRepository, IMapper mapper)
        {
            _sensorRepository = sensorRepository;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<SensorDto>>> GetSensors()
        {
            var sensors = await _sensorRepository.GetSensorsAsync();
            var dtos = _mapper.Map<IEnumerable<SensorDto>>(sensors);
            return Ok(dtos);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<SensorDto>> GetSensor(int id)
        {
            var sensor = await _sensorRepository.GetSensorByIdAsync(id);
            if (sensor == null)
            {
                return NotFound();
            }

            var dto = _mapper.Map<SensorDto>(sensor);
            return Ok(dto);
        }

        [HttpPost]
        public async Task<ActionResult<SensorDto>> CreateSensor(CreateSensorDto dto)
        {
            var sensor = _mapper.Map<Sensor>(dto);
            sensor.Status = SensorStatus.Inactive;

            if (dto.ChannelDefinitionIds != null && dto.ChannelDefinitionIds.Count > 0)
            {
                sensor.SensorChannels = dto.ChannelDefinitionIds
                    .Distinct()
                    .Select(id => new SensorChannel
                    {
                        ChannelDefinitionId = id
                    })
                    .ToList();
            }

            await _sensorRepository.CreateSensorAsync(sensor);

            var resultDto = _mapper.Map<SensorDto>(sensor);
            return CreatedAtAction(nameof(GetSensor), new { id = sensor.Id }, resultDto);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateSensor(int id, UpdateSensorDto dto)
        {
            var sensor = await _sensorRepository.GetSensorByIdAsync(id);
            if (sensor == null)
            {
                return NotFound();
            }

            _mapper.Map(dto, sensor);

            await _sensorRepository.UpdateSensorAsync(sensor);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSensor(int id)
        {
            var sensor = await _sensorRepository.GetSensorByIdAsync(id);
            if (sensor == null)
            {
                return NotFound();
            }

            await _sensorRepository.DeleteSensorAsync(id);
            return NoContent();
        }
    }
}