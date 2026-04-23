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

        public SensorController(ISensorRepository sensorRepository)
        {
            _sensorRepository = sensorRepository;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<SensorDto>>> GetSensors()
        {
            var sensors = await _sensorRepository.GetSensorsAsync();
            var sensorDtos = sensors.Select(s => new SensorDto
            {
                Id = s.Id,
                DeviceId = s.DeviceId,
                Name = s.Name,
                Type = s.Type,
                SensorCode = s.SensorCode,
                Status = s.Status
            });
            return Ok(sensorDtos);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<SensorDto>> GetSensor(int id)
        {
            var sensor = await _sensorRepository.GetSensorByIdAsync(id);

            if (sensor == null)
            {
                return NotFound();
            }

            var sensorDto = new SensorDto
            {
                Id = sensor.Id,
                DeviceId = sensor.DeviceId,
                Name = sensor.Name,
                Type = sensor.Type,
                SensorCode = sensor.SensorCode,
                Status = sensor.Status
            };

            return Ok(sensorDto);
        }

        [HttpPost]
        public async Task<ActionResult<SensorDto>> CreateSensor(CreateSensorDto createSensorDto)
        {
            var sensor = new Sensor
            {
                DeviceId = createSensorDto.DeviceId,
                Name = createSensorDto.Name,
                Type = createSensorDto.Type,
                SensorCode = createSensorDto.SensorCode,
                Status = SensorStatus.Inactive
            };

            await _sensorRepository.CreateSensorAsync(sensor);

            var sensorDto = new SensorDto
            {
                Id = sensor.Id,
                DeviceId = sensor.DeviceId,
                Name = sensor.Name,
                Type = sensor.Type,
                SensorCode = sensor.SensorCode,
                Status = sensor.Status
            };

            return CreatedAtAction(nameof(GetSensor), new { id = sensor.Id }, sensorDto);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateSensor(int id, UpdateSensorDto updateSensorDto)
        {
            var sensor = await _sensorRepository.GetSensorByIdAsync(id);

            if (sensor == null)
            {
                return NotFound();
            }

            sensor.Name = updateSensorDto.Name;
            sensor.Status = updateSensorDto.Status;

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