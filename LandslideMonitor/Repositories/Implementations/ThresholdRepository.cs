using LandslideMonitor.Data;
using LandslideMonitor.Models;
using LandslideMonitor.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace LandslideMonitor.Repositories.Implementations
{
    public class ThresholdRepository : IThresholdRepository
    {
        private readonly AppDbContext _context;

        public ThresholdRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Threshold>> GetThresholdsAsync()
        {
            return await _context.Thresholds.ToListAsync();
        }

        public async Task<Threshold> GetThresholdByIdAsync(int id)
        {
            return await _context.Thresholds.FindAsync(id);
        }

        public async Task CreateThresholdAsync(Threshold threshold)
        {
            _context.Thresholds.Add(threshold);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateThresholdAsync(Threshold threshold)
        {
            _context.Entry(threshold).State = EntityState.Modified;
            await _context.SaveChangesAsync();
        }

        public async Task DeleteThresholdAsync(int id)
        {
            var threshold = await _context.Thresholds.FindAsync(id);
            if (threshold != null)
            {
                _context.Thresholds.Remove(threshold);
                await _context.SaveChangesAsync();
            }
        }
    }
}