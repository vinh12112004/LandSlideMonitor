using LandslideMonitor.Data;
using LandslideMonitor.Hubs;
using LandslideMonitor.Models;
using LandslideMonitor.Services.Interfaces;
using Microsoft.AspNetCore.SignalR;

namespace LandslideMonitor.Services;

public class DeviceStatusService : BackgroundService
{
    private readonly IServiceScopeFactory _scopeFactory;
    private IHubContext<SensorHub> _hub;

    public DeviceStatusService(IServiceScopeFactory scopeFactory, IHubContext<SensorHub> hub)
    {
        _scopeFactory = scopeFactory;
        _hub = hub;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            using var scope = _scopeFactory.CreateScope();
            var deviceService = scope.ServiceProvider.GetRequiredService<IDeviceService>();

            var now = DateTime.UtcNow;

            var threshold = now.AddSeconds(-30);
            var devices = await deviceService.GetOfflineCandidatesAsync(threshold);

            foreach (var device in devices)
            {
                await deviceService.UpdateStatusAsync(
                    device.DeviceId,
                    DeviceStatus.Offline,
                    device.LastSeen,
                    device.LastLatitude,
                    device.LastLongitude
                );
                    
                await _hub.Clients.All.SendAsync("DeviceStatusChanged", new
                {
                    device.DeviceId,
                    device.Status,
                    device.LastSeen
                });
            }
            await Task.Delay(10000, stoppingToken);
        }
    }
}