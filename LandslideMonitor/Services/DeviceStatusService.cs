using LandslideMonitor.Data;
using LandslideMonitor.Models;

namespace LandslideMonitor.Services;

public class DeviceStatusService : BackgroundService
{
    private readonly IServiceScopeFactory _scopeFactory;

    public DeviceStatusService(IServiceScopeFactory scopeFactory)
    {
        _scopeFactory = scopeFactory;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            using var scope = _scopeFactory.CreateScope();
            var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

            var now = DateTime.UtcNow;

            var devices = db.Devices.ToList();

            foreach (var device in devices)
            {
                if ((now - device.LastSeen).TotalSeconds > 30)
                {
                    device.Status = DeviceStatus.Offline;
                }
            }

            await db.SaveChangesAsync();

            await Task.Delay(10000, stoppingToken);
        }
    }
}