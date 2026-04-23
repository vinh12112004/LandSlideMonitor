using AutoMapper;
using LandslideMonitor.DTOs;
using LandslideMonitor.Helpers;
using LandslideMonitor.Models;
using LandslideMonitor.Repositories.Interfaces;
using LandslideMonitor.Services.Interfaces;

namespace LandslideMonitor.Services.Implementations;

public class DeviceService : IDeviceService
{
    private readonly IDeviceRepository _repo;
    private readonly IMapper _mapper;


    public DeviceService(IDeviceRepository repo,  IMapper mapper)
    {
        _repo = repo;
        _mapper = mapper;
    }

    public async Task<PagedResult<DeviceDto>> GetAllAsync(DeviceFilterParams filterParams)
    {
        var devicesPage = await _repo.GetAllAsync(filterParams);

        var deviceDtos = _mapper.Map<IEnumerable<DeviceDto>>(devicesPage.Data);

        return new PagedResult<DeviceDto>(
            deviceDtos,
            devicesPage.TotalCount,
            devicesPage.CurrentPage,
            devicesPage.PageSize
        );
    }

    public async Task<DeviceDto?> GetByIdAsync(string deviceId, bool? isMqtt = false)
    {
        return _mapper.Map<DeviceDto>(await _repo.GetByIdAsync(deviceId, isMqtt));
    }

    public async Task<DeviceDto?> CreateAsync(CreateDeviceDto dto)
    {
        if (!_repo.HasAccessToProvince(dto.ProvinceId))
            throw new UnauthorizedAccessException("Không có quyền tạo thiết bị ở tỉnh này");

        var existing = await _repo.GetByIdAsync(dto.DeviceId);
        if (existing != null)
            return null;

        var device = new Device
        {
            DeviceId = dto.DeviceId,
            Name = dto.Name,
            ProvinceId = dto.ProvinceId,
            Status = DeviceStatus.Offline,
        };

        await _repo.AddAsync(device);
        await _repo.SaveChangesAsync();

        return _mapper.Map<DeviceDto>(device);
    }

    public async Task<bool> DeleteAsync(string deviceId)
    {
        var device = await _repo.GetByIdAsync(deviceId);
        if (device == null)
            return false;

        await _repo.DeleteAsync(device);
        await _repo.SaveChangesAsync();

        return true;
    }

    public async Task<DeviceDto?> UpdateStatusAsync(
        string deviceId,
        DeviceStatus status,
        DateTime lastSeen,
        double? lat,
        double? lon)
    {
        var device = await _repo.GetByIdAsync(deviceId, true);
        if (device == null)
            return null;

        var isChanged =
            device.Status != status ||
            device.LastLatitude != lat ||
            device.LastLongitude != lon;

        device.LastSeen = lastSeen;

        if (isChanged)
        {
            device.Status = status;
            device.LastLatitude = lat;
            device.LastLongitude = lon;

            await _repo.SaveChangesAsync();
        }

        return _mapper.Map<DeviceDto>(device);
    }

    public async Task<List<Device>> GetOfflineCandidatesAsync(DateTime threshold)
    {
        return await _repo.GetOfflineCandidatesAsync(threshold);
    }
    public async Task<DeviceDto?> UpdateAsync(string deviceId, UpdateDeviceDto dto)
    {
        var device = await _repo.GetByIdAsync(deviceId);
        if (device == null)
            return null;

        device.Name = dto.Name;
        device.ProvinceId = dto.ProvinceId;
        device.Status = dto.Status;

        await _repo.UpdateAsync(device);
        await _repo.SaveChangesAsync();

        return _mapper.Map<DeviceDto>(device);
    }
}