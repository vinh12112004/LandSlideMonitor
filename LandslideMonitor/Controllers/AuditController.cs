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
    public async Task<ActionResult<PagedResult<AuditLog>>> Get([FromQuery] AuditLogFilterParams filterParams)
    {
        var query = _context.AuditLogs.AsQueryable();

        if (filterParams.From.HasValue)
        {
            query = query.Where(x => x.CreatedAt >= filterParams.From.Value);
        }

        if (filterParams.To.HasValue)
        {
            query = query.Where(x => x.CreatedAt <= filterParams.To.Value);
        }

        if (!string.IsNullOrWhiteSpace(filterParams.UserId))
        {
            query = query.Where(x => x.UserId == filterParams.UserId);
        }

        if (!string.IsNullOrWhiteSpace(filterParams.ActionType))
        {
            query = query.Where(x => x.ActionType == filterParams.ActionType);
        }

        if (!string.IsNullOrWhiteSpace(filterParams.Id))
        {
            query = query.Where(x => x.NewValues != null && x.NewValues.Contains(filterParams.Id));
        }

        query = query.OrderByDescending(x => x.CreatedAt);

        var result = await query.ToPagedResultAsync(filterParams.PageNumber, filterParams.PageSize);
        return Ok(result);
    }
}

public class AuditLogFilterParams : PaginationParams
{
    public DateTime? From { get; set; }

    public DateTime? To { get; set; }

    public string? UserId { get; set; }

    public string? ActionType { get; set; }

    public string? Id { get; set; }
}
