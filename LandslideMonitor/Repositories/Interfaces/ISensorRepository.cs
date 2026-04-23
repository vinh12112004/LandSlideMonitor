using LandslideMonitor.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace LandslideMonitor.Repositories.Interfaces
{
    public interface ISensorRepository
    {
        Task<IEnumerable<Sensor>> GetSensorsAsync();
        Task<Sensor> GetSensorByIdAsync(int id);
        Task CreateSensorAsync(Sensor sensor);
        Task UpdateSensorAsync(Sensor sensor);
        Task DeleteSensorAsync(int id);
    }
}