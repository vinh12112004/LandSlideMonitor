using LandslideMonitor.Data;
using LandslideMonitor.Hubs;
using LandslideMonitor.Models;
using LandslideMonitor.Services.Interfaces;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace LandslideMonitor.Services;

public class DeviceStatusService : BackgroundService
{
    private readonly IServiceScopeFactory _scopeFactory;
    private readonly IHubContext<SensorHub> _hub;

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
            
            // Thay vì dùng DeviceService gián tiếp, ta gọi thẳng DbContext 
            // để dùng ExecuteUpdateAsync (tối ưu nhất, không bị lỗi Tracking)
            var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

            var now = DateTime.UtcNow;
            var threshold = now.AddSeconds(-1800); // 30 phút không có tín hiệu

            // 1. Lấy danh sách ID các thiết bị Offline để bắn SignalR
            var offlineDeviceIds = db.Devices
                .Where(d => d.LastSeen < threshold && d.Status != DeviceStatus.Offline)
                .Select(d => d.DeviceId)
                .ToList();

            if (offlineDeviceIds.Any())
            {
                // 2. CẬP NHẬT TRẠNG THÁI: Chỉ update cột Status, tuyệt đối không đụng tới Lat/Lon
                await db.Devices
                    .Where(d => offlineDeviceIds.Contains(d.DeviceId))
                    .ExecuteUpdateAsync(s => s.SetProperty(d => d.Status, DeviceStatus.Offline), stoppingToken);

                // 3. Gửi thông báo WebSocket tới Client
                foreach (var deviceId in offlineDeviceIds)
                {
                    await _hub.Clients.All.SendAsync("DeviceStatusChanged", new
                    {
                        DeviceId = deviceId,
                        Status = DeviceStatus.Offline,
                        LastSeen = threshold // Truyền thời gian ngắt kết nối cho UI
                    }, stoppingToken);
                }
            }

            // Chờ 10 giây rồi quét tiếp
            await Task.Delay(10000, stoppingToken);
        }
    }
}