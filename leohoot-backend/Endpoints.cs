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

    record QuestionTeacherDto(int QuestionNumber, string QuestionText, int AnswerTimeInSeconds, string? ImageName, int PreviewTime, AnswerDto[] Answers, int QuizLength);
    record QuestionStudentDto(int QuestionNumber, string QuestionText, int NumberOfAnswers, int CurrentPoints, int Points, int QuizLength);
    record AnswerPostDto(bool[] Answers, string Username);
    record StatisticDto(string QuizName, Player[] TopThreePlayers, Dictionary<int, List<bool>> QuestionAnswers, QuestionDto[] QuestionTexts);
    record RankingDto(Player[] Players, int QuestionNumber, int QuizLength);
   

    private static void ConfigureGameEndpoints(IEndpointRouteBuilder endpoints)
    {
        endpoints.MapGet("/api/games/{gameId}/quiz", (int gameId)=>
        {
            var game = Repository.GetInstance().GetGameById(gameId);
            if (game == null)
            {
                return Results.NotFound("Game not found");
            }

            return Results.Ok(game.Quiz.Id);
        });

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
            if (game == null)
            {
                return Results.NotFound("Game not found");
            }
            return Results.Ok(new RankingDto(game.Ranking.ToArray(), game.CurrentQuestion.QuestionNumber, game.Quiz.Questions.Count));
        });

        endpoints.MapGet("/api/games/{gameId}/statistic", (DataContext ctx, int gameId) => {
            var game = Repository.GetInstance().GetGameById(gameId);
            if (game == null)
            {
                return Results.NotFound("Game not found");
            }
            var questionAnswers = game.Statistic.QuestionAnswers;
            var TopThreePlayers = game.GetRanking(3);
            QuestionDto[] questions = game.Quiz.Questions.Select(q => new QuestionDto(
                q.QuestionNumber, 
                q.QuestionText, 
                q.AnswerTimeInSeconds, 
                q.Answers.Select(a => new AnswerDto(a.AnswerText, a.IsCorrect)).ToList(), 
                q.ImageName, 
                q.PreviewTime)).ToArray();

            return Results.Ok(new StatisticDto(game.Quiz.Title, TopThreePlayers, questionAnswers, questions));
        });

        endpoints.MapGet("/api/games/{gameId}/currentQuestion/teacher", (int gameId) =>
        {
            var game = Repository.GetInstance().GetGameById(gameId);
            if (game == null)
            {
                return Results.NotFound("Game not found");
            }
            var question = new QuestionTeacherDto(
                game.CurrentQuestion.QuestionNumber, 
                game.CurrentQuestion.QuestionText, 
                game.CurrentQuestion.AnswerTimeInSeconds, 
                game.CurrentQuestion.ImageName, 
                game.CurrentQuestion.PreviewTime, 
                game.CurrentQuestion.Answers.Select(a => new AnswerDto(a.AnswerText, a.IsCorrect)).ToArray(),
                game.Quiz.Questions.Count);
            return Results.Ok(question);
        });

        endpoints.MapGet("/api/games/{gameId}/currentQuestion/student", (DataContext ctx, int gameId, string username)=>
        {
            var game = Repository.GetInstance().GetGameById(gameId);
            if (game == null)
            {
                return Results.NotFound("Game not found");
            }
            var questionStudent = new QuestionStudentDto(
                game.CurrentQuestion.QuestionNumber, 
                game.CurrentQuestion.QuestionText,
                game.CurrentQuestion.Answers.Count,
                game.GetCurrentPointsByUsername(username),
                game.GetPointsByUsername(username), 
                game.Quiz.Questions.Count);
            return Results.Ok(questionStudent);
        });

        endpoints.MapPut("/api/games/{gameId}/currentQuestion", async (DataContext ctx, int gameId)=>
        {
            var game = Repository.GetInstance().GetGameById(gameId);
            if (game == null)
            {
                return Results.NotFound("Game not found");
            }
            game.ClearCurrentAnswers();
            var nextQuestion = game.Quiz.Questions.SingleOrDefault(q => q.QuestionNumber == game.CurrentQuestion!.QuestionNumber + 1);
            game.CurrentQuestion = nextQuestion!;
            await ctx.SaveChangesAsync();
            
            await HubContext!.Clients.All.SendAsync("nextQuestion", gameId);
            return Results.Ok(nextQuestion);
        });
        
        endpoints.MapGet("/api/games/{gameId}/exists", (string gameId)=>
        {
            int result;
            Game? game = null;
            if (int.TryParse(gameId, out result))
            {
                game = Repository.GetInstance().GetGameById(result);
            };
            return game != null;
        });

        endpoints.MapDelete("/api/games/{gameId}", (int gameId)=>
        {
            Repository.GetInstance().DeleteGame(gameId);
            return Results.Ok();
        });
    }

    public record AnswerDto(string AnswerText, bool IsCorrect);
    public record QuestionDto(int QuestionNumber, string QuestionText, int AnswerTimeInSeconds, List<AnswerDto> Answers, string ImageName, int PreviewTime);
    public record QuizDto(int Id, string Title, string Description, string CreatorName, List<QuestionDto> Questions, string ImageName);


    private static void ConfigureQuizEndpoints(IEndpointRouteBuilder endpoints)
    {
        endpoints.MapGet("/api/quiz/{quizId}", async (DataContext ctx, int quizId)=>
        {
            return await ctx.GetQuiz(quizId);
        });


        endpoints.MapPost("/api/quiz", async (DataContext ctx, QuizDto quizDto) =>
        {
            var quiz = new Quiz
            {
                Title = quizDto.Title,
                Description = quizDto.Description,
                Creator = ctx.Users.Where(u => u.Username == quizDto.CreatorName).FirstOrDefault(),
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

            return Results.Created($"/api/quiz/{quiz.Id}", quiz.Id);
        });

        endpoints.MapPut("api/quiz/{quizId}", async (DataContext ctx, int quizId, QuizDto quizDto) =>
        {
            var existingQuiz = await ctx.Quizzes.Where(q => q.Id == quizId).FirstOrDefaultAsync();
            if (existingQuiz == null)
            {
                return Results.NotFound("Quiz not found");
            }

            existingQuiz.Title = quizDto.Title;
            existingQuiz.Description = quizDto.Description;
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

            await ctx.SaveChangesAsync();
            return Results.Ok(existingQuiz);
        });}
}