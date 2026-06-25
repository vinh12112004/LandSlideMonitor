
namespace LandslideMonitor.Data;

using System.Security.Claims;

public class AuditContext : IAuditContext
{
    private readonly IHttpContextAccessor _http;

    public AuditContext(IHttpContextAccessor http)
    {
        _http = http;
    }

    public string? UserId =>
        _http.HttpContext?.User?
            .FindFirst(ClaimTypes.NameIdentifier)?.Value;

    public bool ShouldAudit =>
        _http.HttpContext != null;
}