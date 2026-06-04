using LandslideMonitor.Models;

namespace LandslideMonitor.DTOs;

public class RecentAlertDto
{
    public long Id { get; set; }

    public string DeviceId { get; set; } = string.Empty;

    public string DeviceName { get; set; } = string.Empty;

    public string ProvinceName { get; set; } = string.Empty;

    public DataStatus Status { get; set; }
    public string? AlertReason { get; set; }

    public DateTime Timestamp { get; set; }
}