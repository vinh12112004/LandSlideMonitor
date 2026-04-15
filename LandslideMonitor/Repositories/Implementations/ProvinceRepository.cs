using LandslideMonitor.Data;
using LandslideMonitor.Models;
using LandslideMonitor.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace LandslideMonitor.Repositories.Implementations
{
    public class ProvinceRepository : IProvinceRepository
    {
        private readonly AppDbContext _context;

        public ProvinceRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Province>> GetAllAsync()
        {
            return await _context.Provinces.ToListAsync();
        }
    }
}