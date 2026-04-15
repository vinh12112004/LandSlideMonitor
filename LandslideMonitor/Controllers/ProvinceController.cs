using LandslideMonitor.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace LandslideMonitor.Controllers;

[ApiController]
[Route("api/provinces")]
public class ProvinceController : ControllerBase
{
    private readonly IProvinceService _service;

    public ProvinceController(IProvinceService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<IActionResult> GetProvinces()
    {
        return Ok(await _service.GetAllAsync());
    }
}