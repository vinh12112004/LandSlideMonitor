using LandslideMonitor.Data;
using LandslideMonitor.Helpers;
using LandslideMonitor.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LandslideMonitor.Controllers;

[ApiController]
[Route("api/auditlogs")]
public class AuditController : ControllerBase
{
    private readonly AppDbContext _context;

    public AuditController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<PagedResult<AuditLog>>> Get([FromQuery] PaginationParams pagination)
    {
        var query = _context.AuditLogs
            .OrderByDescending(x => x.CreatedAt);

        var result = await query.ToPagedResultAsync(pagination.PageNumber, pagination.PageSize);
        return Ok(result);
    }
}