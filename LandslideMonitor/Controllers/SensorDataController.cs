using LandslideMonitor.Data;
using LandslideMonitor.DTOs;
using LandslideMonitor.Helpers;
using LandslideMonitor.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace LandslideMonitor.Controllers;

[ApiController]
[Route("api/sensordata")]
public class SensorDataController : ControllerBase
{
    private readonly ISensorDataService _dataService;

    public SensorDataController(ISensorDataService dataService)
    {
        _dataService = dataService;
    }

    [HttpGet]
    public async Task<IActionResult> Get([FromQuery] SensorQueryParams param)
    {
        var result = await _dataService.GetPagedAsync(param);
        return Ok(result);
    }
    [HttpGet("latest")]
    public async Task<IActionResult> GetLatestForAllDevices()
    {
        var data = await _dataService.GetLatestForAllDevicesAsync();
        return Ok(data);
    }
}