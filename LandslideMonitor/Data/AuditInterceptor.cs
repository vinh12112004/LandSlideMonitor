using System.Text.Json;
using LandslideMonitor.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;

namespace LandslideMonitor.Data;

public class AuditInterceptor : SaveChangesInterceptor
{
    private readonly IAuditContext _auditContext;

    public AuditInterceptor(IAuditContext auditContext)
    {
        _auditContext = auditContext;
    }

    public override async ValueTask<InterceptionResult<int>> SavingChangesAsync(
        DbContextEventData eventData,
        InterceptionResult<int> result,
        CancellationToken cancellationToken = default)
    {
        var context = eventData.Context;

        if (context == null)
            return await base.SavingChangesAsync(eventData, result, cancellationToken);

        var logs = new List<AuditLog>();

        foreach (var entry in context.ChangeTracker.Entries())
        {
            if (entry.Entity is AuditLog)
                continue;

            if (entry.Entity is not IAuditable)
                continue;

            if (entry.State == EntityState.Modified)
            {
                var oldValues = new Dictionary<string, object?>();
                var newValues = new Dictionary<string, object?>();

                foreach (var prop in entry.Properties)
                {
                    if (prop.IsModified)
                    {
                        oldValues[prop.Metadata.Name] = prop.OriginalValue;
                        newValues[prop.Metadata.Name] = prop.CurrentValue;
                    }
                }

                logs.Add(new AuditLog
                {
                    Id = Guid.NewGuid(),
                    ActionType = "UPDATE",
                    EntityType = entry.Entity.GetType().Name,
                    OldValues = JsonSerializer.Serialize(oldValues),
                    NewValues = JsonSerializer.Serialize(newValues),
                    UserId = _auditContext.UserId,
                    CreatedAt = DateTime.UtcNow
                });
            }
        }

        if (logs.Any())
            context.Set<AuditLog>().AddRange(logs);

        return await base.SavingChangesAsync(eventData, result, cancellationToken);
    }
}