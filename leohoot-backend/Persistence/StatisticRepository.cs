using Base.Persistence;
using Core.Contracts;
using Core.Entities;
using Microsoft.EntityFrameworkCore;

namespace Persistence;

public class StatisticRepository: GenericRepository<Statistic>, IStatisticRepository
{
    private readonly DbSet<Statistic> _statistics;
    public StatisticRepository(DbSet<Statistic> dbSet) : base(dbSet)
    {
        _statistics = dbSet;
    }
    
}