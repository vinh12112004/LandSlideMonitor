using Microsoft.AspNetCore.SignalR;

namespace LandslideMonitor.Hubs;

public class SensorHub : Hub
{
    public async Task JoinDevice(string deviceId)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, deviceId);
    }

    public async Task LeaveDevice(string deviceId)
    {
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, deviceId);
    }
}