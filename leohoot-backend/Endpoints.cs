using Microsoft.EntityFrameworkCore;
using LeohootBackend.Model;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using LeohootBackend.Hubs;
using Microsoft.AspNetCore.SignalR;

namespace LeohootBackend;

public static class Endpoints
{
    public static void ConfigureEndpoints(this WebApplication app)
    {
        ConfigureUserEndpoints(app);
        ConfigureQuizEndpoints(app);
    }

    public record UserPostDto(string Username, string Password);
    private static void ConfigureUserEndpoints(IEndpointRouteBuilder endpoints)
    {
        endpoints.MapGet("/api/users", async (DataContext ctx)=>
        {
            return await ctx.Users.ToListAsync();
        });

        endpoints.MapGet("/api/users/{username}", async (DataContext ctx, string username)=>
        {
            return await ctx.Users.Where(u => u.Username == username).FirstOrDefaultAsync();
        });
        
        endpoints.MapPost("/api/users", async (DataContext ctx, UserPostDto userDto)=>
        {
            var user = new User
            {
                Username = userDto.Username,
                Password = userDto.Password
            };
            ctx.Users.Add(user);
            await ctx.SaveChangesAsync();
            return Results.Created($"/api/users/{user.Username}", user);
        });
    }

    private static void ConfigureQuizEndpoints(IEndpointRouteBuilder endpoints)
    {
        endpoints.MapGet("/api/quizzes", async (DataContext ctx)=>
        {
            return await ctx.Quizzes
                .Select(q => new
                {
                    Id = q.Id,
                    Title = q.Title,
                    Description = q.Description,
                    CreatorName = q.Creator!.Username,
                    QuestionCount = q.Questions.Count,
                    Questions = q.Questions.Select(question => new
                    {
                        Id = question.Id,
                        Text = question.QuestionText,
                        Number = question.QuestionNumber,
                        Answers = question.Answers.Select(answer => new
                        {
                            Id = answer.Id,
                            AnswerText = answer.AnswerText,
                            IsCorrect = answer.IsCorrect
                        }).ToList()
                    }).ToList()

                })
            .ToListAsync();
        });

        endpoints.MapGet("/api/quizzes/{quizId}", async (DataContext ctx, int quizId)=>
        {
            return await ctx.Quizzes
                .Where(q => q.Id == quizId)
                .Select(q => new
                {
                    Id = q.Id,
                    Title = q.Title,
                    Creator = q.Creator!.Username
                })
                .SingleOrDefaultAsync();
        });
        
        endpoints.MapGet("/api/quizzes/{quizId}/questions/{questionNumber}", async (DataContext ctx, int quizId, int questionNumber)=>
        {
            return await ctx.Questions
                .Where(q => q.QuestionNumber == questionNumber && q.QuizId == quizId)
                .Select(q => new
                {
                    Id = q.Id,
                    QuestionText = q.QuestionText,
                    QuestionNumber = q.QuestionNumber,
                    ImageName = q.ImageName,
                    AnswerTimeInSeconds = q.AnswerTimeInSeconds,
                    Answers = q.Answers.Select(answer => new
                    {
                        Id = answer.Id,
                        AnswerText = answer.AnswerText,
                        IsCorrect = answer.IsCorrect
                    }).ToList()
                }).FirstOrDefaultAsync();
        });

        endpoints.MapGet("/api/quizzes/{quizId}/questions/{questionNumber}/mobile", async (DataContext ctx, int quizId, int questionNumber, string username)=>
        {
            var question =  await ctx.Questions
                .Where(q => q.Id == questionNumber)
                .Select(q => new
                {
                    QuestionNumber = q.QuestionNumber,
                    QuestionText = q.QuestionText,
                    AnswerCount = q.Answers.Count,
                    QuizLength = q.Quiz!.Questions.Count,
                }).FirstOrDefaultAsync();

            return new
            {
                Question = question,
                Points = ChatHub.GetPoints(username)
            };
        });

        endpoints.MapGet("/api/quizzes/{quizId}/length", async (DataContext ctx, int quizId)=>
        {
            var question =  await ctx.Quizzes.Where(q => q.Id == quizId).Select(q => new
            {
                Length = q.Questions.Count
            }).FirstOrDefaultAsync();
            return question!.Length;
        });

        endpoints.MapPost("/api/quizzes/{quizId}/questions/{questionNumber}/correct", async (DataContext ctx, int quizId, int questionNumber, bool[] answers)=>
        {
            var question =  await ctx.Questions
                .Where(q => q.QuestionNumber == questionNumber && q.QuizId == quizId)
                .Select(q => new
                {
                    Answers = q.Answers.Select(answer => new
                    {
                        answer.IsCorrect
                    }).ToList()
                }).FirstOrDefaultAsync();
            
            for (int i = 0; i < answers.Length; i++)
            {
                var answer = answers[i];
                var correctAnswer = question!.Answers[i];
                if (answer != correctAnswer.IsCorrect)
                {
                    return false;
                }
            }
            return true;
        });
    }
}