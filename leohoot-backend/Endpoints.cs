using Microsoft.EntityFrameworkCore;
using LeohootBackend.Model;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using LeohootBackend.Hubs;
using Microsoft.AspNetCore.SignalR;
using System.Text.Json;
using System.Net.WebSockets;

namespace LeohootBackend;

public static class Endpoints
{
    public static IHubContext<ChatHub>? HubContext { get; set; }

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

        endpoints.MapDelete("/api/users/reset", () =>
        {
            Repository.GetInstance().Reset();
        });
    }

    record AnswerDto(string AnswerText, bool IsCorrect);
    record QuestionDto(int QuestionNumber, string QuestionText, int AnswerTimeInSeconds, List<AnswerDto> Answers, string? ImageName, int PreviewTime);
    record QuizPostDto(string Title, string Description, List<QuestionDto> Questions,  string Creator);

    private static void ConfigureQuizEndpoints(IEndpointRouteBuilder endpoints)
    {
        endpoints.MapGet("/api/quizzes", async (DataContext ctx)=>
        {
            return await ctx.GetAllQuizzes();
        });

        endpoints.MapGet("/api/quizzes/{quizId}", async (DataContext ctx, int quizId)=>
        {
            return await ctx.GetQuiz(quizId);
        });
        
        endpoints.MapGet("/api/quizzes/{quizId}/questions/{questionNumber}", async (DataContext ctx, int quizId, int questionNumber)=>
        {
            return await ctx.GetQuestion(quizId, questionNumber);
        });

        endpoints.MapGet("/api/quizzes/{quizId}/questions/{questionNumber}/mobile", async (DataContext ctx, int quizId, int questionNumber, string username)=>
        {
            var question = await ctx.GetQuestionStudent(quizId, questionNumber, username);
            int points = Repository.GetInstance().GetPoints(username);
            int currentPoints = Repository.GetInstance().GetCurrentPoints(username);
            return new { Question = question, Points = points, CurrentPoints = currentPoints };
        });

        endpoints.MapGet("/api/quizzes/{quizId}/length", async (DataContext ctx, int quizId)=>
        {
            return await ctx.GetQuizLength(quizId);
        });

        endpoints.MapPost("/api/quizzes/{quizId}/questions/{questionNumber}", async (HttpContext context)=>
        {
            int quizId = int.Parse(context.Request.RouteValues["quizId"] as string ?? "");
            int questionNumber = int.Parse(context.Request.RouteValues["questionNumber"] as string ?? "");
            bool[]? answers = await JsonSerializer.DeserializeAsync<bool[]>(context.Request.Body);
            string? username = context.Request.Query["username"];

            DataContext ctx = context.RequestServices.GetService(typeof(DataContext)) as DataContext ?? throw new Exception("DataContext not found");
            await Repository.GetInstance().AddAnswer(ctx, quizId, questionNumber, answers!, username!);

            await HubContext!.Clients.All.SendAsync("updateAnswerCount", Repository.GetInstance().GetAnswerCount(), Repository.GetInstance().GetPlayerCount());
        });

        endpoints.MapGet("/api/quizzes/ranking", (DataContext context)=>
        {
            return Repository.GetInstance().GetRanking();
        });

        endpoints.MapGet("/api/quizzes/{quizId}/statistic", async (DataContext ctx, int quizId) => {
            var statistic = Repository.GetInstance().GetStatistic();
            var questions = await ctx.GetQuestions(quizId);

            return new { QuestionAnswers = statistic.QuestionAnswers, Questions = questions };
        });

        endpoints.MapPost("/api/quiz", async (DataContext ctx, QuizPostDto quizDto) =>
        {
            var quiz = new Quiz
            {
                Title = quizDto.Title,
                Description = quizDto.Description,
                Creator = ctx.Users.Where(u => u.Username == quizDto.Creator).FirstOrDefault(),
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
                }).ToList()
            };
            ctx.Quizzes.Add(quiz);
            await ctx.SaveChangesAsync();

            return Results.Created($"/api/quiz/{quiz.Id}", quiz);
        });
    }
}