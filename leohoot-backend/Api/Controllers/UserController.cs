using System.ComponentModel.DataAnnotations;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Core;
using Core.Contracts;
using Core.DataTransferObjects;
using Core.Entities;
using Microsoft.AspNetCore.Cryptography.KeyDerivation;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Persistence;

namespace Api.Controllers;

[Route("api/users")]
[ApiController]
public class UserController : Controller
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IConfigurationSection _jwtSettings;

    public UserController(IUnitOfWork unitOfWork, IConfiguration configuration)
    {
        _unitOfWork = unitOfWork;
        _jwtSettings = configuration.GetSection("JwtSettings");
    }

    [HttpPost]
    public async Task<AuthResponseDto> AddNewUser(UserDto userDto)
    {
        var user = new User
        {
            Username = userDto.Username,
            Password = userDto.Password
        };
        try
        {
            await _unitOfWork.Users.AddAsync(user);
            await _unitOfWork.SaveChangesAsync();
        }
        catch (DbUpdateException e)
        {
            return new AuthResponseDto(false, "This username already exists", null);
        }
        return new AuthResponseDto(true, null, GenerateToken(userDto));
    }

    [HttpPut("login")]
    public AuthResponseDto Login(UserDto userDto)
    {
        var token = GenerateToken(userDto);
        return new AuthResponseDto(true, null, token);
    }

    [HttpGet("{username}")]
    public async Task<User?> GetUser(string username)
    {
        var user = await _unitOfWork.Users.GetUserByUsername(username);
        return user;
    }

    private string? GenerateToken(UserDto user)
    {
        var key = Encoding.UTF8.GetBytes(_jwtSettings.GetSection("securityKey").Value!);
        var secret = new SymmetricSecurityKey(key);
        var signingCredentials = new SigningCredentials(secret, SecurityAlgorithms.HmacSha256);
        
         return new JwtSecurityTokenHandler().WriteToken(
            new JwtSecurityToken(
                issuer: _jwtSettings["validIssuer"],
                audience: _jwtSettings["validAudience"],
                claims: new List<Claim>(){new Claim("username", user.Username)},
                expires: DateTime.Now.AddMinutes(Convert.ToDouble(_jwtSettings["expiryInMinutes"])),
                signingCredentials: signingCredentials)
       );
    }
}