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
        byte[] salt = RandomNumberGenerator.GetBytes(128 / 8);
        var hashedPassword = HashPassword(userDto.Password, salt);
        var user = new User
        {
            Username = userDto.Username,
            Password = hashedPassword,
            Salt = salt
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
        return new AuthResponseDto(true, null, GenerateToken(user));
    }

    [HttpPut("login")]
    public async Task<AuthResponseDto> Login(UserDto userDto)
    {
        var user = await _unitOfWork.Users.GetUserByUsername(userDto.Username);
        if (user != null)
        {
            var hashedPassword = HashPassword(userDto.Password, user.Salt);
            if (user.Password == hashedPassword)
            {
                var token = GenerateToken(user);
                return new AuthResponseDto(true, null, token);
            }
        }
        return new AuthResponseDto(false, "Wrong password or username!", null);
    }

    private string? GenerateToken(User user)
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

    private string HashPassword(string password, byte[] salt)
    {
        return Convert.ToBase64String(KeyDerivation.Pbkdf2(
            password: password,
            salt: salt,
            prf: KeyDerivationPrf.HMACSHA256,
            iterationCount: 100000,
            numBytesRequested: 256 / 8)
        );
    }
}