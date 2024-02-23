using System.Runtime.CompilerServices;
using Microsoft.EntityFrameworkCore;
using LeohootBackend.Hubs;
using LeohootBackend.Model;
using System.Collections.Immutable;
using static LeohootBackend.DataContext;

namespace LeohootBackend;

public class Repository
{
    private static Repository? _instance;
    private List<Game> _games = [];

    private Repository()
    {
    }

    /*public void Reset()
    {
        _users.Clear();
        _currentAnswers.Clear();
        _statistic = new Statistic();
        _updatedPoints = false;
    }*/

    public static Repository GetInstance()
    {
        if (_instance == null)
        {
            _instance = new Repository();
        }

        return _instance;
    }


    public async Task<int> CreateGame(int quizId, DataContext ctx)
    {
        int gameId;
        QuizDto? quiz = await ctx.GetQuiz(quizId);
        long timestamp = DateTimeOffset.Now.ToUnixTimeMilliseconds();
        int seed = (timestamp.ToString() + quiz!.Id).GetHashCode();
        Random random = new Random(seed);
        do
        {
            gameId = random.Next(10000000, 100000000);
        } while (_games.Select(g => g.GameId).Contains(gameId));
        _games.Add(await Game.CreateGame(gameId, quizId, ctx));
        return gameId;
    }

    public record CountsDto(int AnswerCount, bool IsFinished);
    
    public CountsDto AddAnswerToGame(int gameId, string username, bool[] answers)
    {
        var game = _games.Find(g => g.GameId == gameId) ?? throw new Exception("Game not found");
        game.AddAnswer(game.GameId, answers, username);
        return new CountsDto(game.AnswerCount, game.PlayerCount == game.AnswerCount);
    }

    public Game GetGameById(int gameId)
    {
        return _games.Find(g => g.GameId == gameId) ?? throw new Exception("Game not found");
    }
}