using Microsoft.EntityFrameworkCore;
using LeohootBackend.Model;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using LeohootBackend.Hubs;
using Microsoft.AspNetCore.SignalR;
using System.Text.Json;
using System.Net.WebSockets;
using System.Diagnostics.Eventing.Reader;
using System.Security.Cryptography.X509Certificates;
using static LeohootBackend.DataContext;

namespace LeohootBackend;

public static class Endpoints
{
    public static IHubContext<ChatHub>? HubContext { get; set; }

    public static void ConfigureEndpoints(this WebApplication app)
    {
        ConfigureUserEndpoints(app);
        ConfigureGameEndpoints(app);
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

        /*endpoints.MapDelete("/api/users/reset", () =>
        {
            Repository.GetInstance().Reset();
        });*/
    }

    record QuestionTeacherDto(int QuestionNumber, string QuestionText, int AnswerTimeInSeconds, string? ImageName, int PreviewTime, AnswerDto[] Answers, int QuizLength);
    record QuestionStudentDto(int QuestionNumber, string QuestionText, int NumberOfAnswers, int CurrentPoints, int Points, int QuizLength);
    record AnswerPostDto(bool[] Answers, string Username);
    record StatisticDto(string QuizName, Player[] TopThreePlayers, Dictionary<int, List<bool>> QuestionAnswers, QuestionDto[] QuestionTexts);
    record RankingDto(Player[] Players, int QuestionNumber, int QuizLength);
    private static void ConfigureGameEndpoints(IEndpointRouteBuilder endpoints)
    {
        endpoints.MapPost("/api/games/{quizId}", async (int quizId, DataContext ctx) =>
        {
            var gameId = await Repository.GetInstance().CreateGame(quizId, ctx);
            return gameId;
        });
        
        endpoints.MapPost("/api/games/{gameId}/answers", async (DataContext ctx, int gameId, AnswerPostDto body) =>
        {
            var count = Repository.GetInstance().AddAnswerToGame(gameId, body.Username, body.Answers);
            await HubContext!.Clients.All.SendAsync("updateAnswerCount", count.AnswerCount, count.IsFinished);
        });

        endpoints.MapGet("/api/games/{gameId}/ranking", (int gameId)=>
        {
            var game = Repository.GetInstance().GetGameById(gameId);
            return new RankingDto(game.Ranking.ToArray(), game.CurrentQuestion.QuestionNumber, game.Quiz.Questions.Count);
        });

        endpoints.MapGet("/api/games/{gameId}/statistic", (DataContext ctx, int gameId) => {
            var game = Repository.GetInstance().GetGameById(gameId);
            var questionAnswers = game.Statistic.QuestionAnswers;
            var questions = game.Quiz.Questions.ToArray();
            var TopThreePlayers = game.GetRanking(3);

            return new StatisticDto(game.Quiz.Title, TopThreePlayers, questionAnswers, questions);
        });

        endpoints.MapGet("/api/games/{gameId}/currentQuestion/teacher", (int gameId) =>
        {
            var game = Repository.GetInstance().GetGameById(gameId);
            var question = new QuestionTeacherDto(
                game.CurrentQuestion.QuestionNumber, 
                game.CurrentQuestion.QuestionText, 
                game.CurrentQuestion.AnswerTimeInSeconds, 
                game.CurrentQuestion.ImageName, 
                game.CurrentQuestion.PreviewTime, 
                game.CurrentQuestion.Answers.ToArray(), 
                game.Quiz.Questions.Count);
            return question;
        });

        endpoints.MapGet("/api/games/{gameId}/currentQuestion/student", (DataContext ctx, int gameId, string username)=>
        {
            var game = Repository.GetInstance().GetGameById(gameId);
            var questionStudent = new QuestionStudentDto(
                game.CurrentQuestion.QuestionNumber, 
                game.CurrentQuestion.QuestionText,
                game.CurrentQuestion.Answers.Count,
                game.GetCurrentPointsByUsername(username),
                game.GetPointsByUsername(username), 
                game.Quiz.Questions.Count);
            return questionStudent;
        });

        endpoints.MapPut("/api/games/{gameId}/currentQuestion", async (DataContext ctx, int gameId)=>
        {
            var game = Repository.GetInstance().GetGameById(gameId);
            var nextQuestion = game.Quiz.Questions.SingleOrDefault(q => q.QuestionNumber == game.CurrentQuestion!.QuestionNumber + 1);
            game.CurrentQuestion = nextQuestion;
            await ctx.SaveChangesAsync();
            return nextQuestion;
        });
        
    }
}