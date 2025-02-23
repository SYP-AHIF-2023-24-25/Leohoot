using Base.Core.Contracts;
using Core.DataTransferObjects;
using Core.Entities;

namespace Core.Contracts;

public interface IStatisticRepository: IGenericRepository<Statistic>
{
    public Task<List<StatisticOverviewDto>> GetAllStatisticsAsync();
    public Task<StatisticDetailsDto?> GetStatisticsByStatisticIdAsync(int quizId);
    public Task<StatisticDto?> GetStatisticForTableByIdAsync(int statisticId);
    public Task<List<GameStatisticQuestion>?> GetGameStatisticAsync(int statisticId);
}