using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Api.Hubs;
using Persistence;
using Core;
using Core.Contracts;
using Core.DataTransferObjects;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;

namespace Api.Controllers;

[AllowAnonymous]
[Route("api/games")]
[ApiController]
public class GameController : Controller
{
    private readonly IUnitOfWork _unitOfWork;
    public static IHubContext<LeohootHub>? HubContext { get; set; }

    public GameController(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }
    
    [Authorize]
    [HttpPost("{quizId:int}")]
    public async Task<int> AddNewGame(int quizId)
    {
        var gameId = await Repository.GetInstance().AddNewGame(quizId, _unitOfWork);
        return gameId;
    }

    [HttpGet("{gameId:int}")]
    public IResult GetQuizNumberByGameId(int gameId)
    {
        var game = Repository.GetInstance().GetGameById(gameId);
        if (game == null)
        {
            return Results.NotFound("Game not found");
        }
        return Results.Ok(game.Quiz.Id);
    }
    
    [HttpPost("{gameId}/answers")]
    public async Task AddNewAnswerToGame(int gameId, AnswerPostDto body)
    {
        var count = Repository.GetInstance().AddAnswerToGame(gameId, body.Username, body.Answers);
        await HubContext!.Clients.All.SendAsync("updateAnswerCount", count.AnswerCount, count.IsFinished);
    }
    
    [HttpGet("{gameId:int}/ranking")]
    public IResult GetRankingOfGame(int gameId)
    {
        var game = Repository.GetInstance().GetGameById(gameId);
        if (game == null)
        {
            return Results.NotFound("Game not found");
        }
        return Results.Ok(new RankingDto(game.Ranking.ToArray(), game.CurrentQuestion.QuestionNumber, game.Quiz.Questions.Count));
    }
    
    [HttpGet("{gameId:int}/statistic")]
    public IResult GetStatisticOfGame(int gameId) 
    {
        var game = Repository.GetInstance().GetGameById(gameId);
        if (game == null)
        {
            return Results.NotFound("Game not found");
        }
        var questionAnswers = game.Statistic.QuestionAnswers;
        var topThreePlayers = game.GetRanking(3);
        QuestionDto[] questions = game.Quiz.Questions.Select(q => new QuestionDto(
            q.QuestionNumber, 
            q.QuestionText, 
            q.AnswerTimeInSeconds, 
            q.Answers.Select(a => new AnswerDto(a.AnswerText, a.IsCorrect)).ToList(), 
            q.ImageName, 
            q.PreviewTime,
            q.Snapshot,
            q.ShowMultipleChoice
            )).ToArray();
        return Results.Ok(new StatisticDto(game.Quiz.Title, topThreePlayers, questionAnswers, questions, game.PlayerCount));
    }

    [HttpGet("{gameId:int}/playerResult")]
    public IResult GetPlayerResult(int gameId, string username) 
    {
        var game = Repository.GetInstance().GetGameById(gameId);
        if (game == null)
        {
            return Results.NotFound("Game not found");
        }
        var ranking = game.GetRanking(game.PlayerCount);
        

        var playerResult = new PlayerResultDto(
            game.Quiz.Title,
            game.GetPointsByUsername(username),
            ranking.ToList().FindIndex(p => p.Username == username) + 1,
            game.PlayerCount
        );

        return Results.Ok(playerResult);
    }
    
    [Authorize]
    [HttpGet("{gameId:int}/currentQuestion/teacher")]
    public IResult GetCurrentQuestionOfGameTeacher (int gameId)
    {
        //string? Snapshot, int PreviewTime, AnswerDto[] Answers, bool ShowMultipleChoice, int QuizLength);
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
            game.CurrentQuestion.Snapshot,
            game.CurrentQuestion.PreviewTime, 
            game.CurrentQuestion.Answers.Select(a => new AnswerDto(a.AnswerText, a.IsCorrect)).ToArray(),
            game.CurrentQuestion.ShowMultipleChoice,
            game.Quiz.Questions.Count);
        return Results.Ok(question);
    }
    
    [HttpGet("{gameId:int}/currentQuestion/student")]
    public IResult GetCurrentQuestionOfGameStudent (int gameId, string username)
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
    }
    
    [Authorize]
    [HttpPut("{gameId:int}/currentQuestion")]
    public async Task<IResult> NextQuestion (int gameId)
    {
        var game = Repository.GetInstance().GetGameById(gameId);
        if (game == null)
        {
            return Results.NotFound("Game not found");
        }
        game.ClearCurrentAnswers();
        var nextQuestion = game.Quiz.Questions.SingleOrDefault(q => q.QuestionNumber == game.CurrentQuestion!.QuestionNumber + 1);
        
        if (nextQuestion != null)
        {
            var shuffledAnswers = nextQuestion.Answers.OrderBy(a => Guid.NewGuid()).ToList();
            nextQuestion = new QuestionDto(
                nextQuestion.QuestionNumber, 
                nextQuestion.QuestionText, 
                nextQuestion.AnswerTimeInSeconds, 
                shuffledAnswers, 
                nextQuestion.ImageName, 
                nextQuestion.PreviewTime,
                nextQuestion.Snapshot,
                nextQuestion.ShowMultipleChoice
            );
        }

        game.CurrentQuestion = nextQuestion!;
        await _unitOfWork.SaveChangesAsync();
            
        return Results.Ok(nextQuestion);
    }
    
    [HttpGet("{gameId}/exists")]
    public bool DoesGameExist(string gameId)
    {
        Game? game = null;
        if (int.TryParse(gameId, out var result))
        {
            game = Repository.GetInstance().GetGameById(result);
        }
        return game != null;
    }
    
    [Authorize]
    [HttpDelete("{gameId:int}")]
    public IResult DeleteGame(int gameId)
    {
        Repository.GetInstance().DeleteGame(gameId);
        return Results.Ok();
    }
}