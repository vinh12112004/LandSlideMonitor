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

    [HttpGet("alerts")]
    public async Task<IActionResult> GetAlerts([FromQuery] SensorQueryParams param)
    {
        var result = await _dataService.GetAlertsPagedAsync(param);
        return Ok(result);
    }

    [HttpGet("latest-all")]
    public async Task<IActionResult> GetLatestForAllDevices([FromQuery] int? provinceId)
    {
        var data = await _dataService.GetLatestForAllDevicesAsync(provinceId);
        return Ok(data);
    }
}