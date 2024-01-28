using System.Runtime.CompilerServices;
using Microsoft.EntityFrameworkCore;
using LeohootBackend.Hubs;
using LeohootBackend.Model;

namespace LeohootBackend;

public class Repository
{
    private static Repository? _instance;
    static List<Player> _currentAnswers = [];

    private List<Player> _users = [];

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

    public bool RegisterUser(string username)
    {
        if (_users.Find(user => user.Username == username) == null)
        {
            _users.Add(new Player(username, 0));
            return true;
        }
        return false;
    }

    public List<Player> GetRanking()
    {
        return _users.OrderByDescending(u => u.Score).Take(5).ToList();
    }

    public int GetPoints(string username)
    {
        return _users.Find(user => user.Username == username)!.Score;
    }

    public int GetCurrentPoints(string username)
    {
        Player? answer = _currentAnswers.Find(user => user.Username == username);
        if (answer == null)
        {
            return 0;
        }
        return answer.Score;
    }

    public int GetAnswerCount()
    {
        return _currentAnswers.Count;
    }

    public int GetPlayerCount()
    {
        return _users.Count;
    }

    public void UpdatePoints()
    {
        foreach (Player user in _currentAnswers)
        {
            Player userToUpdate = _users.Find(userToUpdate => userToUpdate.Username == user.Username)!;
            userToUpdate.Score += user.Score;
        }
    }

    public void ClearCurrentAnswers()
    {
        _currentAnswers.Clear();
    }

    
    public async Task AddAnswer(DataContext ctx, int quizId, int questionNumber, bool[] answers, string username)
    {
        int score = 0;
        bool isCorrect = await ctx.IsAnswerCorrect(quizId, questionNumber, answers);
        var currentCorrectAnswers = _currentAnswers.FindAll(answer => answer.Score > 0).ToList();
        if (isCorrect)
        {
            score = 1000 - 1000/_users.Count*currentCorrectAnswers.Count;
        }
        _currentAnswers.Add(new Player(username, score));
    }

}