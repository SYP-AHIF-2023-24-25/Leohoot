using System.Runtime.InteropServices.JavaScript;
using Base.Persistence;
using Core.Contracts;
using Core.Entities;
using Microsoft.EntityFrameworkCore;
using Core.DataTransferObjects;

namespace Persistence;

public class StatisticRepository: GenericRepository<Statistic>, IStatisticRepository
{
    private readonly DbSet<Statistic> _statistics;
    public StatisticRepository(DbSet<Statistic> dbSet) : base(dbSet)
    {
        _statistics = dbSet;
    }

    public Task<List<StatisticOverviewDto>> GetAllStatisticsAsync()
    {
        return _statistics
            .OrderByDescending(s => s.StartTime)
            .Select(s => new StatisticOverviewDto(
                s.Id,
                s.StartTime, 
                s.EndTime, 
                0,
                s.QuizName,
                s.StudentsCount,
                s.QuizId)
            )
            .ToListAsync();
    }

    public async Task<StatisticDetailsDto?> GetStatisticsByStatisticIdAsync(int statisticId)
    {
        var statistic = await _statistics
            .Include(s => s.Questions)
            .ThenInclude(q => q.Answers)
            .SingleOrDefaultAsync(s => s.Id == statisticId);
        
        if (statistic == null) return null;
        
        var usernames = statistic.Questions
            .SelectMany(q => q.Answers.SelectMany(a => a.UserNames).ToList())
            .Distinct()
            .ToList();

        var users = usernames
            .Select(user => new StatisticDetailsUserDto(
                user,
                statistic.Questions.Select(q => new StatisticDetailsQuestionDto(
                    q.QuestionText,
                    q.Answers.Select(a => new StatisticDetailsAnswerDto(
                        a.AnswerText,
                        a.UserNames.Contains(user),
                        a.IsCorrect
                    )).ToList()
                )).ToList(),
                false,
                statistic.Questions.Count(q => q.Answers
                    .All(a => 
                        (a.IsCorrect && a.UserNames.Contains(user)) || 
                        (!a.IsCorrect && !a.UserNames.Contains(user))
                    )),
                statistic.Questions.Count))
            .OrderBy(u => u.Username)
            .ToList();

        return new StatisticDetailsDto(statistic.QuizName, users);
    }

    public async Task<StatisticDto?> GetStatisticForTableByIdAsync(int statisticId)
    {
        var statistic = await _statistics
            .Include(s => s.Questions)
            .ThenInclude(s => s.Answers)
            .SingleOrDefaultAsync(s => s.Id == statisticId);
        if (statistic == null) return null;
        var questionAnswers = statistic.Questions.ToDictionary(
            q => q.QuestionNumber,
            q => q.Answers
                .SelectMany(a => a.UserNames.Select(u => new { Username = u, IsCorrect = a.IsCorrect }))
                .GroupBy(a => a.Username)
                .Select(g => g.All(a => a.IsCorrect))
                .ToList()
            );
        var questionTexts = statistic.Questions
            .Select(q => q.QuestionText)
            .ToList();
        return new StatisticDto(statistic.QuizName, [], questionAnswers, questionTexts, statistic.StudentsCount);

    }

    public async Task<List<GameStatisticQuestion>?> GetGameStatisticAsync(int statisticId)
    {
        var statisticTable = await GetStatisticForTableByIdAsync(statisticId);
        if (statisticTable == null) return null;
        var questions = new List<GameStatisticQuestion>();
        for (int i = 0; i < statisticTable.QuestionTexts.Count; i++)
        {
            var correctAnswers = statisticTable.QuestionAnswers[i+1].Count(a => a);
            var wrongAnswers = statisticTable.QuestionAnswers[i+1].Count(a => !a);
            var notGivenAnswers = statisticTable.PlayerCount - correctAnswers - wrongAnswers;
            questions.Add(new GameStatisticQuestion(statisticTable.QuestionTexts[i], correctAnswers, wrongAnswers, notGivenAnswers));
        }
        return questions;
    }
}