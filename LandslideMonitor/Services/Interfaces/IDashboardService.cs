using LandslideMonitor.DTOs;

namespace LandslideMonitor.Services.Interfaces;

public interface IDashboardService
{
    Task<DashboardSummaryDto> GetSummaryAsync();
}