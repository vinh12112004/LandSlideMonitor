using LandslideMonitor.Data;
using LandslideMonitor.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LandslideMonitor.Controllers;

[ApiController]
[Route("api/sensor")]
public class SensorController : ControllerBase
{
    private readonly ISensorService _service;

    public SensorController(ISensorService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<IActionResult> Get()
    {
        var data = await _service.GetLatestAsync(50);
        return Ok(data);
    }
}