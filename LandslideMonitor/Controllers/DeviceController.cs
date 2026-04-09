using LandslideMonitor.Data;
using LandslideMonitor.DTOs;
using LandslideMonitor.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LandslideMonitor.Controllers;

[ApiController]
[Route("api/devices")]
public class DeviceController : ControllerBase
{
    private readonly AppDbContext _db;

    public DeviceController(AppDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<IActionResult> GetDevices()
    {
        var devices = await _db.Devices.ToListAsync();
        return Ok(devices);
    }

    [HttpPost]
    public async Task<IActionResult> CreateDevice([FromBody] CreateDeviceDto createDto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var device = new Device
        {
            DeviceId = createDto.DeviceId,
            Location = createDto.Location,
            Status = DeviceStatus.Offline,
        };

        var existingDevice = await _db.Devices.FindAsync(device.DeviceId);
        if (existingDevice != null)
        {
            return Conflict("Device with this ID already exists.");
        }

        await _db.Devices.AddAsync(device);
        await _db.SaveChangesAsync();

        return CreatedAtAction(nameof(GetDeviceById), new { deviceId = device.DeviceId }, device);
    }

    [HttpGet("{deviceId}")]
    public async Task<IActionResult> GetDeviceById(string deviceId)
    {
        var device = await _db.Devices.FindAsync(deviceId);
        if (device == null)
        {
            return NotFound();
        }
        return Ok(device);
    }
    [HttpDelete("{deviceId}")]
    public async Task<IActionResult> DeleteDevice(string deviceId)
    {
        var device = await _db.Devices.FindAsync(deviceId);
        if (device == null)
        {
            return NotFound();
        }

        _db.Devices.Remove(device);
        await _db.SaveChangesAsync();

        return NoContent();
    }
}