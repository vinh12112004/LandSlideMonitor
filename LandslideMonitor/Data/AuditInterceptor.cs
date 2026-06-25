using System.Text.Json;
using LandslideMonitor.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
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
        // Không audit nếu request không có user (MQTT service, BackgroundService...)
        if (!_auditContext.ShouldAudit)
        {
            return await base.SavingChangesAsync(
                eventData,
                result,
                cancellationToken
            );
        }

        var context = eventData.Context;

        if (context == null)
        {
            return await base.SavingChangesAsync(
                eventData,
                result,
                cancellationToken
            );
        }

        var logs = new List<AuditLog>();

        foreach (var entry in context.ChangeTracker.Entries())
        {
            // tránh loop vô hạn
            if (entry.Entity is AuditLog)
                continue;

            // chỉ entity cần audit
            if (entry.Entity is not IAuditable)
                continue;

            switch (entry.State)
            {
                // CREATE
                case EntityState.Added:
                {
                    var newValues = new Dictionary<string, object?>();
                    foreach (var prop in entry.Properties)
                    {
                        // Bỏ qua Khóa chính (Primary Key) không đưa vào JSON
                        if (prop.Metadata.IsPrimaryKey())
                            continue;

                        newValues[prop.Metadata.Name] = prop.CurrentValue;
                    }

                    logs.Add(new AuditLog
                    {
                        Id = Guid.NewGuid(),
                        UserId = _auditContext.UserId,
                        ActionType = "CREATE",
                        EntityType = entry.Entity.GetType().Name,
                        NewValues = JsonSerializer.Serialize(newValues),
                        Description = GenerateDescription(entry),
                        CreatedAt = DateTime.UtcNow
                    });
                    break;
                }

                // UPDATE
                case EntityState.Modified:
                {
                    var oldValues = new Dictionary<string, object?>();
                    var newValues = new Dictionary<string, object?>();

                    foreach (var prop in entry.Properties)
                    {
                        // BẮT BUỘC LƯU PRIMARY KEY DÙ KHÔNG BỊ MODIFIED
                        if (prop.Metadata.IsPrimaryKey())
                        {
                            oldValues[prop.Metadata.Name] = prop.OriginalValue;
                            newValues[prop.Metadata.Name] = prop.CurrentValue;
                            continue;
                        }

                        // Chỉ lưu các trường có sự thay đổi
                        if (!prop.IsModified)
                            continue;

                        oldValues[prop.Metadata.Name] = prop.OriginalValue;
                        newValues[prop.Metadata.Name] = prop.CurrentValue;
                    }

                    logs.Add(new AuditLog
                    {
                        Id = Guid.NewGuid(),
                        UserId = _auditContext.UserId,
                        ActionType = "UPDATE",
                        EntityType = entry.Entity.GetType().Name,
                        OldValues = JsonSerializer.Serialize(oldValues),
                        NewValues = JsonSerializer.Serialize(newValues),
                        Description = GenerateDescription(entry),
                        CreatedAt = DateTime.UtcNow
                    });
                    break;
                }

                // DELETE
                case EntityState.Deleted:
                {
                    var oldValues = new Dictionary<string, object?>();
                    foreach (var prop in entry.Properties)
                    {
                        oldValues[prop.Metadata.Name] = prop.OriginalValue;
                    }

                    logs.Add(new AuditLog
                    {
                        Id = Guid.NewGuid(),
                        UserId = _auditContext.UserId,
                        ActionType = "DELETE",
                        EntityType = entry.Entity.GetType().Name,
                        OldValues = JsonSerializer.Serialize(oldValues),
                        Description = GenerateDescription(entry),
                        CreatedAt = DateTime.UtcNow
                    });
                    break;
                }
            }
        }

        // thêm log vào cùng transaction
        if (logs.Any())
        {
            context.Set<AuditLog>().AddRange(logs);
        }

        return await base.SavingChangesAsync(
            eventData,
            result,
            cancellationToken
        );
    }

    private string GenerateDescription(EntityEntry entry)
    {
        var entityName = entry.Entity.GetType().Name;

        return entry.State switch
        {
            EntityState.Added =>
                $"Created new {entityName}",

            EntityState.Deleted =>
                $"Deleted {entityName}",

            EntityState.Modified =>
                $"Updated {entityName}",

            _ => $"{entry.State} {entityName}"
        };
    }
}