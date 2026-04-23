using LandslideMonitor.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace LandslideMonitor.Repositories.Interfaces
{
    public interface IThresholdRepository
    {
        Task<IEnumerable<Threshold>> GetThresholdsAsync();
        Task<Threshold> GetThresholdByIdAsync(int id);
        Task CreateThresholdAsync(Threshold threshold);
        Task UpdateThresholdAsync(Threshold threshold);
        Task DeleteThresholdAsync(int id);
    }
}