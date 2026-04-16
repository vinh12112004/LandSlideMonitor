using LandslideMonitor.Data;
using LandslideMonitor.DTOs;
using LandslideMonitor.Helpers;
using LandslideMonitor.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LandslideMonitor.Controllers;

[ApiController]
[Authorize]
[Route("api/devices")]
public class DeviceController : ControllerBase
{
    private readonly IDeviceService _service;

    public DeviceController(IDeviceService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<ActionResult<PagedResult<DeviceDto>>> GetDevices([FromQuery] DeviceFilterParams filterParams)
    {
        return Ok(await _service.GetAllAsync(filterParams));
    }

    [HttpGet("{deviceId}")]
    public async Task<IActionResult> GetDeviceById(string deviceId)
    {
        var device = await _service.GetByIdAsync(deviceId);
        if (device == null) return NotFound();
        return Ok(device);
    }

    [HttpPost]
    public async Task<IActionResult> CreateDevice(CreateDeviceDto dto)
    {
        var device = await _service.CreateAsync(dto);
        if (device == null)
            return Conflict("Device already exists");

        return CreatedAtAction(nameof(GetDeviceById), new { deviceId = device.DeviceId }, device);
    }

    [HttpDelete("{deviceId}")]
    public async Task<IActionResult> DeleteDevice(string deviceId)
    {
        var result = await _service.DeleteAsync(deviceId);
        if (!result) return NotFound();

        return NoContent();
    }
    [HttpPut("{deviceId}")]
    public async Task<IActionResult> UpdateDevice(string deviceId, UpdateDeviceDto dto)
    {
        var device = await _service.UpdateAsync(deviceId, dto);
        if (device == null)
            return NotFound();

        return Ok(device);
    }
}