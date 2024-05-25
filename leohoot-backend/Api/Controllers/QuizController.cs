using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Core;
using Microsoft.AspNetCore.Http;
using Persistence;
using ConsoleApp;
using System.Net.Http.Headers;
using System.IO;
using System.Net.Http;
using System.Threading.Tasks;
using Core.Contracts;
using Microsoft.Extensions.Options;
using Core.DataTransferObjects;
using Core.Entities;

namespace Api.Controllers;

[Route("api/quizzes")]
[ApiController]
public class QuizController : Controller
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly LeohootSettings _settings;

    public QuizController(IUnitOfWork unitOfWork, IOptions<LeohootSettings> settings)
    {
        _unitOfWork = unitOfWork;
        _settings = settings.Value;
    }
    
    [HttpGet("{quizId:int}")]
    public async Task<QuizDto?> GetQuizById(int quizId)
    {
        return await _unitOfWork.Quizzes.GetQuizDto(quizId);
    }

    [HttpGet]
    public async Task<List<QuizDto>> GetAllQuizzes()
    {
        return await _unitOfWork.Quizzes.GetAllQuizzes();
    }
    
    [HttpPost]
    public async Task<IResult> PostNewQuiz(QuizPostDto quizDto)
    {
        var creator = await _unitOfWork.Users.GetUserByUsername(quizDto.Creator);

        if (creator == null)
        {
            Console.WriteLine("Creator not found");
             return Results.NotFound($"/api/quizzes/");
        }

        var quiz = new Quiz
        {
            Title = quizDto.Title,
            Description = quizDto.Description,
            Creator = creator,
            Questions = quizDto.Questions.Select(q => new Question
            {
                QuestionNumber = q.QuestionNumber,
                QuestionText = q.QuestionText,
                AnswerTimeInSeconds = q.AnswerTimeInSeconds,
                Answers = q.Answers.Select(a => new Answer
                {
                    AnswerText = a.AnswerText,
                    IsCorrect = a.IsCorrect
                }).ToList(),
                ImageName = q.ImageName,
                Snapshot = q.Snapshot,
                PreviewTime = q.PreviewTime,
                ShowMultipleChoice = q.ShowMultipleChoice
            }).ToList(),
            ImageName = quizDto.ImageName
        };

        await _unitOfWork.Quizzes.AddAsync(quiz);
        await _unitOfWork.SaveChangesAsync();
        return Results.Created($"/api/quizzes/{quiz.Id}", quiz.Id);
    }

    [HttpPut("{quizId:int}")]
    public async Task<IResult> UpdateQuiz(int quizId, QuizPostDto quizDto)
    {
        var existingQuiz = await _unitOfWork.Quizzes.GetQuiz(quizId);
        if (existingQuiz == null)
        {
            return Results.NotFound("Quiz not found");
        }

        existingQuiz.Title = quizDto.Title;
        existingQuiz.Description = quizDto.Description;
        existingQuiz.ImageName = quizDto.ImageName;
        if (quizDto.Questions.Count == 0){
            existingQuiz.Questions.Clear();
        } else {
            existingQuiz.Questions = quizDto.Questions.Select(q => new Question
            {
                QuestionNumber = q.QuestionNumber,
                QuestionText = q.QuestionText,
                AnswerTimeInSeconds = q.AnswerTimeInSeconds,
                Answers = q.Answers.Select(a => new Answer
                {
                    AnswerText = a.AnswerText,
                    IsCorrect = a.IsCorrect
                }).ToList(),
                ImageName = q.ImageName,
                Snapshot = q.Snapshot,
                PreviewTime = q.PreviewTime,
                ShowMultipleChoice = q.ShowMultipleChoice
            }).ToList();
        }

        await _unitOfWork.SaveChangesAsync();
        return Results.Ok(existingQuiz);
    }

    [HttpDelete("{quizId:int}")]
    public async Task<IResult> DeleteQuiz(int quizId)
    {
        var quiz = await _unitOfWork.Quizzes.GetQuiz(quizId);
        if (quiz == null)
        {
            return Results.NotFound("Quiz not found");
        }

        _unitOfWork.Quizzes.Remove(quiz);
        await _unitOfWork.SaveChangesAsync();
        return Results.Ok();
    }

    [HttpPost("init")]
    public async Task<IResult> InitQuizzes()
    {
        var quizzes = Importer.ImportQuizzes();
        await _unitOfWork.DeleteDatabaseAsync();
        await _unitOfWork.CreateDatabaseAsync();
        await _unitOfWork.Quizzes.AddRangeAsync(quizzes);
        await _unitOfWork.SaveChangesAsync();
        return Results.Ok();
    }

    [HttpPost("upload/images")]
    public async Task<IResult> UploadImage(IFormFile image)
    {
        var imageRow = new Image();
        await _unitOfWork.Images.AddAsync(imageRow);
        await _unitOfWork.SaveChangesAsync();

        var nextVal = imageRow.Id.ToString().PadLeft(2, '0');
        var newImageName = $"{nextVal}_{image.FileName}";

        var directoryPath = Path.Combine(_settings.ImagePath);
        var filePath = Path.Combine(directoryPath, newImageName);
        
        if (!Directory.Exists(directoryPath))
        {
            Directory.CreateDirectory(directoryPath);
        }
       
        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await image.CopyToAsync(stream);
        }

        return Results.Created($"/cdn/images/{newImageName}", newImageName);
    }    
}