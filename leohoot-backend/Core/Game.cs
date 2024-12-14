using System.Collections.Immutable;
using Core.Entities;
using Core.DataTransferObjects;

namespace Core;

public class Game
{
    public int GameId { get; private set; }
    public QuizDto Quiz { get; set; }        
    public QuestionDto CurrentQuestion { get; set; }
    public Statistic Statistic { get; set; }

    private List<Player> _players;
    private List<Player> _currentAnswers;
    private bool _updatedPoints;

    public ImmutableList<Player> Ranking => _players.OrderByDescending(u => u.Score).Take(5).ToImmutableList();
    public int AnswerCount => _currentAnswers.Count;
    public int PlayerCount => _players.Count;

    public Game(int gameId, QuizDto quiz, QuestionDto question)
    {
        GameId = gameId;
        Quiz = quiz;
        CurrentQuestion = new QuestionDto (
            question.QuestionNumber,
            question.QuestionText,
            question.AnswerTimeInSeconds,
            question.Answers.OrderBy(a => Guid.NewGuid()).ToList(),
            question.ImageName,
            question.PreviewTime,
            question.Snapshot,
            question.ShowMultipleChoice
        );

        Statistic = new Statistic();

        _players = [];
        _currentAnswers = [];
        _updatedPoints = false;
    }

    public bool RegisterUser(string username)
    {
        if (_players.Find(user => user.Username == username) == null)
        {
            _players.Add(new Player(username, 0));
            return true;
        }
        return false;
    }

    public void DeleteUser(string username)
    {
        _players.RemoveAll(user => user.Username == username);
    }

    public int GetPointsByUsername(string username)
    {
        return _players.Find(user => user.Username == username)!.Score;
    }

    public int GetCurrentPointsByUsername(string username)
    {
        Player? answer = _currentAnswers.Find(user => user.Username == username);
        if (answer == null)
        {
            return 0;
        }
        return answer.Score;
    }

    public void UpdatePoints()
    {
        if (!_updatedPoints)
        {
            foreach (Player user in _currentAnswers)
            {
                Player userToUpdate = _players.Find(userToUpdate => userToUpdate.Username == user.Username)!;
                userToUpdate.Score += user.Score;
            }
        }
        _updatedPoints = true;
    }

    public void ClearCurrentAnswers()
    {
        _updatedPoints = false;
        _currentAnswers.Clear();
    }

    public void AddAnswer(int quizId, bool[] answers, string username)
    {
        int score = 0;
        var isCorrect = IsAnswerCorrect(answers);
        var currentCorrectAnswers = _currentAnswers.FindAll(answer => answer.Score > 0).ToList();
        if (isCorrect)
        {
            score = 1000 - 1000/_players.Count*currentCorrectAnswers.Count;
        }
        _currentAnswers.Add(new Player(username, score));
        Statistic.AddAnswerToStatistic(CurrentQuestion!.QuestionNumber, answers, isCorrect);
    }
    private bool IsAnswerCorrect(bool[] answers)
    {
        return !answers.Where((t, i) => t != CurrentQuestion!.Answers[i].IsCorrect).Any();
    }

    public Player[] GetRanking(int numberOfPlayers)
    {
        var ranking = _players
            .OrderByDescending(u => u.Score)
            .Take(numberOfPlayers).ToList();
        while (ranking.Count < 3) {
            ranking.Add(new Player("", 0));
        }
        return ranking.ToArray();
    }
}
