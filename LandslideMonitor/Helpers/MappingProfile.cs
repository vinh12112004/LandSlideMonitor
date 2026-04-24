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

        // Sensor 
        CreateMap<Sensor, SensorDto>()
            .ForMember(d => d.Channels, o => o.MapFrom(s => s.SensorChannels));

        CreateMap<SensorChannel, SensorChannelDto>()
            .ForMember(d => d.ChannelDefinitionId, o => o.MapFrom(s => s.ChannelDefinitionId))
            .ForMember(d => d.ChannelName, o => o.MapFrom(s => s.ChannelDefinition.Name))
            .ForMember(d => d.DataKey, o => o.MapFrom(s => s.ChannelDefinition.DataKey))
            .ForMember(d => d.UnitSymbol, o => o.MapFrom(s => s.ChannelDefinition.UnitSymbol));

        CreateMap<CreateSensorDto, Sensor>();
        CreateMap<UpdateSensorDto, Sensor>();
        // SensorType
        CreateMap<CreateChannelDefinitionDto, ChannelDefinition>();
        CreateMap<UpdateChannelDefinitionDto, ChannelDefinition>();
        CreateMap<ChannelDefinition, ChannelDefinitionDto>();
        // Threshold
        CreateMap<Threshold, ThresholdDto>()
            .ForMember(d => d.ChannelDefinitionId, o => o.MapFrom(s => s.channelDefinitionid))
            .ForMember(d => d.ChannelName, o => o.MapFrom(s => s.channelDefinition.Name))
            .ForMember(d => d.DataKey, o => o.MapFrom(s => s.channelDefinition.DataKey))
            .ForMember(d => d.UnitSymbol, o => o.MapFrom(s => s.channelDefinition.UnitSymbol))
            .ForMember(d => d.Comparison, o => o.Ignore());

        CreateMap<CreateThresholdDto, Threshold>()
            .ForMember(d => d.channelDefinitionid, o => o.MapFrom(s => s.ChannelDefinitionId));

        CreateMap<UpdateThresholdDto, Threshold>();
    }
}