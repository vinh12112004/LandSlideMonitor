using LandslideMonitor.Models;

namespace LandslideMonitor.Repositories.Interfaces;

public interface IProvinceRepository
{
    Task<IEnumerable<Province>> GetAllAsync();
}