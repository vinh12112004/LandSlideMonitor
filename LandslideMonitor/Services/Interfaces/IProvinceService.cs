using LandslideMonitor.DTOs;

namespace LandslideMonitor.Services.Interfaces
{
    public interface IProvinceService
    {
        Task<IEnumerable<ProvinceDto>> GetAllAsync();
    }
}