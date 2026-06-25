using System.Security.Claims;

namespace LandslideMonitor.Data;

public class AuditContext : IAuditContext
{
    private readonly IHttpContextAccessor _http;

    public AuditContext(IHttpContextAccessor http)
    {
        _http = http;
    }


    public string? UserId =>
        _http.HttpContext?.User?.FindFirst("sub")?.Value
        ?? _http.HttpContext?.User?
            .FindFirst(ClaimTypes.NameIdentifier)?.Value;
}