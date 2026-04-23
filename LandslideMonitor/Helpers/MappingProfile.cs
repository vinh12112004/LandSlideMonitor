using AutoMapper;
using LandslideMonitor.DTOs;
using LandslideMonitor.Models;

namespace LandslideMonitor.Helpers;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        // Device → DeviceDto
        CreateMap<Device, DeviceDto>()
            .ForMember(dest => dest.ProvinceName,
                opt => opt.MapFrom(src => src.Province.Name));

        // Sensor → SensorDto
        CreateMap<Sensor, SensorDto>();
    }
}