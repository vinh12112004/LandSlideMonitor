namespace LandslideMonitor.DTOs;

public class DashboardSummaryDto
{
    public string ScopeName { get; set; } = string.Empty;

    public int TotalDevices { get; set; }

    public int OnlineDevices { get; set; }

    public int OfflineDevices { get; set; }

    public int MaintenanceDevices { get; set; }

    public int NormalDevices { get; set; }

    public int WarningDevices { get; set; }

    public int AlertDevices { get; set; }

    public List<RecentAlertDto> RecentAlerts { get; set; } = [];
}