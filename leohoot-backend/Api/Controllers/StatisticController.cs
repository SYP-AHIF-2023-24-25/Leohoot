using Core.Contracts;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.VisualBasic;

namespace Api.Controllers;

[Authorize]
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

    [HttpGet("{quidId}")]
    public async Task<IResult> GetStatistic(int quidId)
    {
        var statistic = await _unitOfWork.Statistics.GetStatisticsByQuizIdAsync(quidId);
        return Results.Ok(statistic);
    }
}