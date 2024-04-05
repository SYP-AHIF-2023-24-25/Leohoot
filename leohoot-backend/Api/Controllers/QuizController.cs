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
namespace Api.Controllers;

[Route("api/quizzes")]
[ApiController]
public class QuizController : Controller
{
    private readonly ApplicationDbContext _context;

    public QuizController(ApplicationDbContext context)
    {
        _context = context;
    }
    
    [HttpGet("{quizId:int}")]
    public async Task<QuizDto?> GetQuizById(int quizId)
    {
        return await _context.GetQuiz(quizId);
    }

    [HttpGet]
    public async Task<List<QuizDto>> GetAllQuizzes()
    {
        return await _context.GetAllQuizzes();
    }
    
    [HttpPost]
    public async Task<IResult> PostNewQuiz(QuizPostDto quizDto)
    {
        var creator = _context.Users.FirstOrDefault(u => u.Username == quizDto.Creator);

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

        _context.Quizzes.Add(quiz);
        await _context.SaveChangesAsync();
        return Results.Created($"/api/quizzes/{quiz.Id}", quiz.Id);
    }

    [HttpPost("upload/images")]
    public async Task<IResult> UploadImage(IFormFile file)
    {
        /*if (file == null || file.Length == 0)
        {
            return Results.BadRequest("No file uploaded");
        }

        var fileName = file.FileName;
        var filePath = "/public/images/" + fileName;
        using (var stream = System.IO.File.Create(filePath))
        {
            await file.CopyToAsync(stream);
        }

        return Results.Ok(filePath);*/

        if (file == null || file.Length == 0)
        {
            return Results.BadRequest("Please select a file.");
        }

        var folderName = Path.Combine("wwwroot", "images");
        var pathToSave = Path.Combine(Directory.GetCurrentDirectory(), folderName);

        if (!Directory.Exists(pathToSave))
        {
            Directory.CreateDirectory(pathToSave);
        }

        var fileName = ContentDispositionHeaderValue.Parse(file.ContentDisposition).FileName.Trim('"');
        var fullPath = Path.Combine(pathToSave, fileName);
        var dbPath = Path.Combine(folderName, fileName);

        if (System.IO.File.Exists(fullPath))
        {
            return Results.BadRequest($"{fileName} already exists on the server!");
        }

        using (var stream = new FileStream(fullPath, FileMode.Create))
        {
            await file.CopyToAsync(stream);
        }

        return Results.Ok(new { dbPath });
    }
    
    [HttpPut("{quizId:int}")]
    public async Task<IResult> UpdateQuiz(int quizId, QuizPostDto quizDto)
    {
        var existingQuiz = await _context.Quizzes.Where(q => q.Id == quizId).FirstOrDefaultAsync();
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

        await _context.SaveChangesAsync();
        return Results.Ok(existingQuiz);
    }

    [HttpDelete("{quizId:int}")]
    public async Task<IResult> DeleteQuiz(int quizId)
    {
        var quiz = await _context.Quizzes.Where(q => q.Id == quizId).FirstOrDefaultAsync();
        if (quiz == null)
        {
            return Results.NotFound("Quiz not found");
        }

        _context.Quizzes.Remove(quiz);
        await _context.SaveChangesAsync();
        return Results.Ok();
    }

    [HttpPost("init")]
    public async Task<IResult> InitQuizzes()
    {
        var quizzes = Importer.ImportQuizzes();
        _context.Database.EnsureDeleted();
        _context.Database.EnsureCreated();
        _context.Quizzes.AddRange(quizzes);
        await _context.SaveChangesAsync();
        return Results.Ok();
    }
}