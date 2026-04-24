using LandslideMonitor.Data;
using LandslideMonitor.Models;
using LandslideMonitor.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace LandslideMonitor.Repositories.Implementations
{
    public class SensorRepository : ISensorRepository
    {
        private readonly AppDbContext _context;

        public SensorRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Sensor>> GetSensorsAsync()
        {
            return await _context.Sensors
                .Include(s => s.SensorChannels)
                .ThenInclude(sc => sc.ChannelDefinition)
                .ToListAsync();
        }

        public async Task<Sensor> GetSensorByIdAsync(int id)
        {
            return await _context.Sensors
                .Include(s => s.SensorChannels)
                .ThenInclude(sc => sc.ChannelDefinition)
                .FirstOrDefaultAsync(s => s.Id == id);
        }

        public async Task CreateSensorAsync(Sensor sensor)
        {
            _context.Sensors.Add(sensor);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateSensorAsync(Sensor sensor)
        {
            _context.Entry(sensor).State = EntityState.Modified;
            await _context.SaveChangesAsync();
        }

        public async Task DeleteSensorAsync(int id)
        {
            var sensor = await _context.Sensors.FindAsync(id);
            if (sensor != null)
            {
                _context.Sensors.Remove(sensor);
                await _context.SaveChangesAsync();
            }
        }
    }
}