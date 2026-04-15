using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using LandslideMonitor.Models;
using Microsoft.IdentityModel.Tokens;

namespace LandslideMonitor.Services;

public class JwtService
{
    private readonly IConfiguration _config;

    public JwtService(IConfiguration config)
    {
        _config = config;
    }

    public string GenerateToken(User user)
    {
        var provinceIds = user.UserProvinces
            ?.Select(x => x.ProvinceId.ToString()) ?? new List<string>();

        var claims = new[]
        {
            new Claim("sub", user.Id.ToString()),
            new Claim("role", user.Role),
            new Claim("provinces", string.Join(",", provinceIds))
        };

        var key = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(_config["Jwt:Key"])
        );

        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            _config["Jwt:Issuer"],
            _config["Jwt:Audience"],
            claims,
            expires: DateTime.UtcNow.AddMinutes(
                int.Parse(_config["Jwt:ExpiresInMinutes"])
            ),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}