using System.Text;
using Core.Contracts;
using Core.DataTransferObjects;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.VisualBasic;

namespace Api.Controllers;

//[Authorize]
[Route("api/statistics")]
[ApiController]
public class StatisticController: Controller
{
    private readonly IUnitOfWork _unitOfWork;
    public StatisticController(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    [HttpGet]
    public async Task<IResult> GetStatistics()
    {
        var statistics = await _unitOfWork.Statistics.GetAllStatisticsAsync();
        return Results.Ok(statistics);
    }

    [HttpGet("{statisticId}")]
    public async Task<IResult> GetStatistic(int statisticId)
    {
        var statistic = await _unitOfWork.Statistics.GetStatisticsByStatisticIdAsync(statisticId);
        return Results.Ok(statistic);
    }
    
    [AllowAnonymous]
    [HttpGet("{statisticId}/download")]
    public async Task<IResult> GetStatisticDownload(int statisticId)
    {
        var statistic = await _unitOfWork.Statistics.GetStatisticsByStatisticIdAsync(statisticId);
        if (statistic == null) return Results.NotFound();
        var csvData = statistic.Users.SelectMany(u => u.Questions
            .SelectMany(q => q.Answers
                .Select(a => $"{u.Username};{q.QuestionText};{a.AnswerText};{a.IsCorrect};{a.IsTicked};").ToList()
            ).ToList()
        ).ToList();
        var csvString = "User; Question; Answer; Is Answer Correct; Ticked;\n" + string.Join('\n', csvData);
        var bytes = Encoding.UTF8.GetBytes(csvString);
        var result = Results.File(bytes, "text/csv", "statistics.csv");
        return result;
    }
    
    [HttpGet("{statisticId}/game")]
    public async Task<IResult> GetStatisticGame(int statisticId)
    {
        var statistic = await _unitOfWork.Statistics.GetStatisticForTableByIdAsync(statisticId);
        return Results.Ok(statistic);
    }

    [HttpGet("{statisticId}/game/download")]
    public async Task<IResult> GetStatisticGameDownload(int statisticId)
    {
        var questions = await _unitOfWork.Statistics.GetGameStatisticAsync(statisticId);
        if (questions == null) return Results.NotFound();
        var csvData = questions.Select(q => $"{q.QuestionText};{q.CorrectAnswers};{q.WrongAnswers};{q.NotGivenAnswers};").ToList();
        var csvString = "Question; Correct Answers; Wrong Answers; Not Given Answers;\n" + string.Join('\n', csvData);
        var bytes = Encoding.UTF8.GetBytes(csvString);
        var result = Results.File(bytes, "text/csv", "statistics.csv");
        return result;
    }
}