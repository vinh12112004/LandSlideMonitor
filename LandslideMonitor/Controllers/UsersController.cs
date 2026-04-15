using LandslideMonitor.DTOs;
using LandslideMonitor.Helpers;
using LandslideMonitor.Services;
using LandslideMonitor.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LandslideMonitor.Controllers;

// [Authorize(Roles = "Admin")]
[ApiController]
[Route("api/users")]
public class UsersController : ControllerBase
{
    private readonly AuthService _auth;
    private readonly IUserService _userService;

    public UsersController(AuthService auth, IUserService userService)
    {
        _auth = auth;
        _userService = userService;
    }

    [HttpPost]
    public async Task<IActionResult> Create(CreateUserRequest req)
    {
        await _auth.CreateUser(req);
        return Ok();
    }
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, UpdateUserRequest req)
    {
        await _auth.UpdateUser(id, req);
        return Ok();
    }
    [HttpGet]
    public async Task<ActionResult<PagedResult<UserDto>>> GetUsers([FromQuery] UserFilterParams filterParams)
    {
        var users = await _userService.GetUsers(filterParams);
        return Ok(users);
    }
}