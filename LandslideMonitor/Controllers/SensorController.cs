using LandslideMonitor.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LandslideMonitor.Controllers;

[ApiController]
[Route("api/sensor")]
public class SensorController : ControllerBase
{
    private readonly AppDbContext _db;

    public SensorController(AppDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<IActionResult> Get()
    {
        var data = await _db.SensorDatas
            .OrderByDescending(x => x.Timestamp)
            .Take(50)
            .ToListAsync();

        return Ok(data);
    }
}