namespace LandslideMonitor.Data;

public interface IAuditContext
{
    string? UserId { get; }
    bool ShouldAudit { get; }

}