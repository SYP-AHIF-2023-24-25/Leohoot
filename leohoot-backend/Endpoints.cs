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
    }
}