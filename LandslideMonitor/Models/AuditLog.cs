namespace LandslideMonitor.Models;

public class AuditLog
{
    public Guid Id { get; set; }

    public int? UserId { get; set; }
    public User? User { get; set; }

    public string ActionType { get; set; } = default!;

    public string EntityType { get; set; } = default!;

    public string? EntityId { get; set; }

    public string? OldValues { get; set; }

    public string? NewValues { get; set; }

    public string? Description { get; set; }
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}