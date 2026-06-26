namespace LandslideMonitor.Data;

public interface IAuditContext
{
    int? UserId { get; }
    bool ShouldAudit { get; }

}