using Base.Core.Contracts;
using Core.DataTransferObjects;
using Core.Entities;

namespace Core.Contracts;

public interface IStatisticRepository: IGenericRepository<Statistic>
{
    public Task<List<StatisticOverviewDto>> GetAllStatisticsAsync();
    public Task<StatisticDetailsDto?> GetStatisticsByQuizIdAsync(int quizId);
}