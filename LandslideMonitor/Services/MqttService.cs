using System.Text;
using System.Text.Json;
using LandslideMonitor.Data;
using LandslideMonitor.DTOs;
using LandslideMonitor.Models;
using MQTTnet;
using MQTTnet.Client;

namespace LandslideMonitor.Services;

public class MqttService : BackgroundService
{
    private readonly IServiceScopeFactory _scopeFactory;

    public MqttService(IServiceScopeFactory scopeFactory)
    {
        _scopeFactory = scopeFactory;
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

                using var scope = _scopeFactory.CreateScope();
                var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

                var entity = new SensorData
                {
                    DeviceId = dto.DeviceId,
                    Timestamp = dto.Timestamp,
                    SoilMoisture = dto.SoilMoisture,

                    AccelX = dto.Accel.X,
                    AccelY = dto.Accel.Y,
                    AccelZ = dto.Accel.Z,

                    Latitude = dto.Gps.Lat,
                    Longitude = dto.Gps.Lon
                };

                db.SensorDatas.Add(entity);
                await db.SaveChangesAsync();
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