using LandslideMonitor.DTOs;
using LandslideMonitor.Services;
using Microsoft.AspNetCore.Mvc;

namespace LandslideMonitor.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly AuthService _auth;

    public AuthController(AuthService auth)
    {
        _auth = auth;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginRequest req)
    {
        return Ok(await _auth.Login(req.Username, req.Password));
    }
    [HttpPost("logout")]
    public async Task<IActionResult> Logout([FromBody] string refreshToken)
    {
        await _auth.Logout(refreshToken);
        return Ok();
    }
}