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
            .WithTcpServer("localhost", 1883)
            .Build();

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
                var device = await deviceService.GetByIdAsync(dto.DeviceId);
                if (device == null)
                {
                    Console.WriteLine("Device not found → ignore");
                    return;
                }
                var wasOffline = device.Status == DeviceStatus.Offline;
                //  update device
                var updatedDevice = await deviceService.UpdateStatusAsync(
                    dto.DeviceId,
                    DeviceStatus.Online,
                    dto.Timestamp,
                    dto.Gps?.Lat,
                    dto.Gps?.Lon
                );
                
                if (updatedDevice == null) return;
                await sensorService.ProcessSensorDataAsync(dto);
                
                // signalR
                await _hub.Clients.Group(dto.DeviceId).SendAsync("ReceiveSensorData", new
                {
                    dto.DeviceId,
                    dto.Timestamp,
                    dto.SoilMoisture,
                    dto.Accel,
                    dto.Gps
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

        await client.ConnectAsync(options, stoppingToken);
        await client.SubscribeAsync("landslide/+/data");

        Console.WriteLine("MQTT Connected!");

        await Task.Delay(Timeout.Infinite, stoppingToken);
    }
}