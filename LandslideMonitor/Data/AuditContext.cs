
namespace LandslideMonitor.Data;

using System.Security.Claims;

public class AuditContext : IAuditContext
{
    private readonly IHttpContextAccessor _http;

    public AuditContext(IHttpContextAccessor http)
    {
        _http = http;
    }

    public int? UserId =>
        int.TryParse(
            _http.HttpContext?.User?
                .FindFirst(ClaimTypes.NameIdentifier)?.Value,
            out var id
        )
            ? id
            : null;

    public bool ShouldAudit =>
        _http.HttpContext != null;
}