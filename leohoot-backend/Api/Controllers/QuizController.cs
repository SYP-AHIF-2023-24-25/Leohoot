using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Core;
using Microsoft.AspNetCore.Http;
using Persistence;

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
             return Results.NotFound($"/api/quiz/");
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
                PreviewTime = q.PreviewTime
            }).ToList(),
            ImageName = quizDto.ImageName
        };

        _context.Quizzes.Add(quiz);
        await _context.SaveChangesAsync();
        return Results.Created($"/api/quiz/{quiz.Id}", quiz.Id);
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
                PreviewTime = q.PreviewTime
            }).ToList();
        }

        await _context.SaveChangesAsync();
        return Results.Ok(existingQuiz);
    }
}