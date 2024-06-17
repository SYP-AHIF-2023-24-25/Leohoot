using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Core;
using Core.Contracts;
using Core.DataTransferObjects;
using Persistence;

namespace Api;

public class Repository
{
    private static Repository? _instance;
    private List<Game> _games = [];

    private Repository()
    {
    }

    public static Repository GetInstance()
    {
        if (_instance == null)
        {
            _instance = new Repository();
        }

        return _instance;
    }
    
    public static async Task<Game> CreateGame(int gameId, int quizId, IUnitOfWork uow)
    {
        QuizDto? quiz = await uow.Quizzes.GetQuizDto(quizId);
        QuestionDto? question = await uow.Quizzes.GetQuestion(quizId, 1);
        if (quiz == null || question == null)
        {
            throw new Exception("Invalid quiz or question");
        }
        return new Game(gameId, quiz, question);
    }

    public async Task<int> AddNewGame(int quizId, IUnitOfWork uow)
    {
        int gameId;
        QuizDto? quiz = await uow.Quizzes.GetQuizDto(quizId);

        long timestamp = DateTimeOffset.Now.ToUnixTimeMilliseconds();
        int seed = (timestamp.ToString() + quiz!.Id).GetHashCode();
        Random random = new Random(seed);
        do
        {
            gameId = random.Next(10000000, 100000000);
        } while (_games.Select(g => g.GameId).Contains(gameId));
        _games.Add(await CreateGame(gameId, quizId, uow));
        return gameId;
    }

    public record CountsDto(int AnswerCount, bool IsFinished);
    
    public CountsDto AddAnswerToGame(int gameId, string username, bool[] answers)
    {
        var game = _games.Find(g => g.GameId == gameId) ?? throw new Exception("Game not found");
        game.AddAnswer(game.GameId, answers, username);
        return new CountsDto(game.AnswerCount, game.PlayerCount == game.AnswerCount);
    }

    public Game? GetGameById(int gameId)
    {
        return _games.Find(g => g.GameId == gameId);
    }

    public void DeleteGame(int gameId)
    {
        _games.RemoveAll(g => g.GameId == gameId);
    }
}