using System.Text;
using System.Text.Json;
using LandslideMonitor.Data;
using LandslideMonitor.DTOs;
using LandslideMonitor.Hubs;
using LandslideMonitor.Models;
using LandslideMonitor.Services.Interfaces;
using Microsoft.AspNetCore.SignalR;
using MQTTnet;
using MQTTnet.Client;

namespace LandslideMonitor.Services;

public class MqttService : BackgroundService
{
    private readonly IServiceScopeFactory _scopeFactory;
    private IHubContext<SensorHub> _hub;

    public MqttService(IServiceScopeFactory scopeFactory,IHubContext<SensorHub> hub)
    {
        _scopeFactory = scopeFactory;
        _hub = hub;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        var factory = new MqttFactory();
        var client = factory.CreateMqttClient();

        var options = new MqttClientOptionsBuilder()
            .WithTcpServer("mqtt", 1883)
            .WithCleanSession()
            .Build();
        client.DisconnectedAsync += async e =>
        {
            Console.WriteLine("MQTT bị ngắt kết nối. Đang chờ 5 giây để thử lại...");
            await Task.Delay(TimeSpan.FromSeconds(5), stoppingToken);
        
            try
            {
                if (!client.IsConnected)
                {
                    await client.ConnectAsync(options, stoppingToken);
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Lỗi kết nối lại: {ex.Message}");
            }
        };
        client.ApplicationMessageReceivedAsync += async e =>
        {
            try
            {
                var payload = Encoding.UTF8.GetString(e.ApplicationMessage.Payload);
                Console.WriteLine($"MQTT: {payload}");

                var dto = JsonSerializer.Deserialize<SensorDataDto>(
                    payload,
                    new JsonSerializerOptions
                    {
                        PropertyNameCaseInsensitive = true
                    }
                );

                if (dto == null || string.IsNullOrEmpty(dto.DeviceId))
                    return;

                using var scope = _scopeFactory.CreateScope();
                var deviceService = scope.ServiceProvider.GetRequiredService<IDeviceService>();
                var sensorService = scope.ServiceProvider.GetRequiredService<ISensorDataService>();
                var device = await deviceService.GetByIdAsync(dto.DeviceId,true);
                if (device == null)
                {
                    Console.WriteLine(dto.DeviceId);
                    Console.WriteLine("Device not found → ignore");
                    return;
                }
                double? lat = dto.Data.ContainsKey("lat") ? dto.Data["lat"] : null;
                double? lon = dto.Data.ContainsKey("lon") ? dto.Data["lon"] : null;
                var wasOffline = device.Status == DeviceStatus.Offline;
                //  update device
                var updatedDevice = await deviceService.UpdateStatusAsync(
                    dto.DeviceId,
                    DeviceStatus.Online,
                    dto.Timestamp,
                    lat,
                    lon
                );
                
                if (updatedDevice == null) return;
                var saved = await sensorService.ProcessSensorDataAsync(dto);

                await _hub.Clients.All.SendAsync("ReceiveSensorData", new
                {
                    id = saved.id,
                    deviceId = saved.DeviceId,
                    timestamp = saved.Timestamp,
                    jsonData = saved.JsonData,
                    status = saved.Status,
                    alertReason = saved.AlertReason
                });
                if (wasOffline && updatedDevice.Status == DeviceStatus.Online)
                {
                    await _hub.Clients.All.SendAsync("DeviceStatusChanged", new
                    {
                        updatedDevice.DeviceId,
                        updatedDevice.Status,
                        updatedDevice.LastSeen,
                        updatedDevice.LastLatitude,
                        updatedDevice.LastLongitude
                    });
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
            }
        };

        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                await client.ConnectAsync(options, stoppingToken);
                await client.SubscribeAsync("landslide/+/data");
                Console.WriteLine("Kết nối MQTT tới broker 'mqtt' thành công!");
                break; // Thoát vòng lặp khi kết nối thành công
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Không thể kết nối broker: {ex.Message}. Đang thử lại...");
                await Task.Delay(5000, stoppingToken);
            }
        }

        await Task.Delay(Timeout.Infinite, stoppingToken);
    }
}