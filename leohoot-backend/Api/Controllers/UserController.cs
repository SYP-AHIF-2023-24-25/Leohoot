using Core;
using Core.Contracts;
using Core.DataTransferObjects;
using Core.Entities;
using Microsoft.AspNetCore.Mvc;
using Persistence;

namespace Api.Controllers;

[Route("api/quizzes")]
[ApiController]
public class UserController : Controller
{
    private readonly IUnitOfWork _unitOfWork;

    public UserController(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    [HttpPost("{quizId:int}/users")]
    public async Task AddNewUserToQuiz(UserDto userDto)
    {
        var user = new User
        {
            Username = userDto.Username,
            Password = userDto.Password,
            Salt = userDto.Salt
        };
        await _unitOfWork.Users.AddAsync(user);
        await _unitOfWork.SaveChangesAsync();
    }
}