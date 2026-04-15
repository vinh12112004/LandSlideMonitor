using LandslideMonitor.DTOs;
using LandslideMonitor.Repositories.Interfaces;
using LandslideMonitor.Services.Interfaces;

namespace LandslideMonitor.Services.Implementations
{
    public class ProvinceService : IProvinceService
    {
        private readonly IProvinceRepository _repository;

        public ProvinceService(IProvinceRepository repository)
        {
            _repository = repository;
        }

        public async Task<IEnumerable<ProvinceDto>> GetAllAsync()
        {
            var provinces = await _repository.GetAllAsync();
            return provinces.Select(p => new ProvinceDto { Id = p.Id, Name = p.Name });
        }
    }
}