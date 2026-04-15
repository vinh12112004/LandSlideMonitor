using LandslideMonitor.Data;
using LandslideMonitor.DTOs;
using LandslideMonitor.Models;
using LandslideMonitor.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace LandslideMonitor.Services;

public class AuthService
{
    private readonly IUserRepository _userRepo;
    private readonly AppDbContext _context;
    private readonly JwtService _jwt;

    public AuthService(IUserRepository userRepo, AppDbContext context, JwtService jwt)
    {
        _userRepo = userRepo;
        _context = context;
        _jwt = jwt;
    }

    public async Task<object> Login(string username, string password)
    {
        var user = await _userRepo.GetByUsername(username);

        if (user == null || !BCrypt.Net.BCrypt.Verify(password, user.PasswordHash))
            throw new Exception("Invalid credentials");

        var accessToken = _jwt.GenerateToken(user);

        var refreshToken = new RefreshToken
        {
            UserId = user.Id,
            Token = Guid.NewGuid().ToString(),
            ExpiryDate = DateTime.UtcNow.AddDays(7)
        };

        _context.RefreshTokens.Add(refreshToken);
        await _context.SaveChangesAsync();

        return new
        {
            accessToken,
            refreshToken = refreshToken.Token,
            user = new
            {
                id = user.Id,
                username = user.Username,
                role = user.Role,
                provinceIds = user.UserProvinces.Select(x => x.ProvinceId)
            }
        };
    }
    public async Task CreateUser(CreateUserRequest req)
    {
        if (req.Role != "Manager" && req.Role != "Admin")
            throw new Exception("Invalid role");
        if (req.Role == "Manager" && (req.ProvinceIds == null || !req.ProvinceIds.Any()))
            throw new Exception("Manager must have provinces");

        var user = new User
        {
            Username = req.Username,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(req.Password),
            Role = req.Role,
            UserProvinces = req.ProvinceIds?
                .Select(pid => new UserProvince { ProvinceId = pid })
                .ToList()
        };

        await _userRepo.Add(user);
    }
    public async Task Logout(string refreshToken)
    {
        var token = await _context.RefreshTokens
            .FirstOrDefaultAsync(x => x.Token == refreshToken);

        if (token != null)
        {
            _context.RefreshTokens.Remove(token);
            await _context.SaveChangesAsync();
        }
    }
    public async Task UpdateUser(int id, UpdateUserRequest req)
    {
        var user = await _userRepo.GetById(id);
        if (user == null)
            throw new Exception("User not found");

        if (req.Username != null)
        {
            user.Username = req.Username;
        }

        if (!string.IsNullOrEmpty(req.Password))
        {
            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(req.Password);
        }

        if (req.Role != null )
        {
            if (req.Role != "Admin" && req.Role != "Manager")
            {
                throw new Exception("Invalid role");
            }
            user.Role = req.Role;
        }

        if (req.ProvinceIds != null)
        {
            user.UserProvinces.Clear();
            foreach (var provinceId in req.ProvinceIds)
            {
                user.UserProvinces.Add(new UserProvince { ProvinceId = provinceId });
            }
        }

        await _userRepo.Update(user);
    }
}