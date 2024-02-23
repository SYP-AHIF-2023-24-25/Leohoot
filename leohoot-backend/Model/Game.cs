using System.Collections.Immutable;
using Microsoft.EntityFrameworkCore;
using static LeohootBackend.DataContext;

namespace LeohootBackend.Model
{
    public class Game
    {
        public int GameId { get; private set; }
        public QuizDto Quiz { get; set; }        
        public QuestionDto? CurrentQuestion { get; set; }
        public Statistic Statistic { get; set; }

        private List<Player> _players;
        private List<Player> _currentAnswers;
        private bool _updatedPoints;

        public ImmutableList<Player> Ranking => _players.OrderByDescending(u => u.Score).Take(5).ToImmutableList();
        public int AnswerCount => _currentAnswers.Count;
        public int PlayerCount => _players.Count;

        private Game(int gameId, QuizDto quiz, QuestionDto question)
        {
            GameId = gameId;
            Quiz = quiz;
            CurrentQuestion = question;

            Statistic = new Statistic();

            _players = [];
            _currentAnswers = [];
            _updatedPoints = false;
        }

        public static async Task<Game> CreateGame(int gameId, int quizId, DataContext ctx)
        {
            QuizDto? quiz = await ctx.GetQuiz(quizId);
            QuestionDto? question = await ctx.GetQuestion(quizId, 1);
            if (quiz == null || question == null)
            {
                throw new Exception("Invalid quiz or question");
            }
            return new Game(gameId, quiz, question);
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
            bool isCorrect = IsAnswerCorrect(answers);
            var currentCorrectAnswers = _currentAnswers.FindAll(answer => answer.Score > 0).ToList();
            if (isCorrect)
            {
                score = 1000 - 1000/_players.Count*currentCorrectAnswers.Count;
            }
            _currentAnswers.Add(new Player(username, score));
            AddAnswerToStatistic(CurrentQuestion!.QuestionNumber, isCorrect);
        }

        private bool IsAnswerCorrect(bool[] answers)
        {
            for (int i = 0; i < answers.Length; i++)
            {
                if (answers[i] != CurrentQuestion!.Answers[i].IsCorrect)
                {
                    return false;
                }
            }
            return true;
        }

        private void AddAnswerToStatistic(int questionNumber, bool isCorrect)
        {
            if (Statistic.QuestionAnswers.ContainsKey(questionNumber))
            {
                Statistic.QuestionAnswers[questionNumber].Add(isCorrect);
            }
            else
            {
                Statistic.QuestionAnswers.TryAdd(questionNumber, new List<bool> {isCorrect});
            }
        }

        public Player[] GetRanking(int numberOfPlayers)
        {
            return _players.OrderByDescending(u => u.Score).Take(numberOfPlayers).ToArray();
        }
    }
}