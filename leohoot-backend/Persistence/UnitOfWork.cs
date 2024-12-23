using Core.Contracts;
using Core.Entities;

namespace Persistence;

using Base.Persistence;

public class UnitOfWork : BaseUnitOfWork, IUnitOfWork
{
    private readonly ApplicationDbContext? _dbContext;
    public UnitOfWork() : this(new ApplicationDbContext()) { }
    public UnitOfWork(ApplicationDbContext dBContext) : base(dBContext) 
    {
        _dbContext = dBContext;
        Quizzes = new QuizRepository(_dbContext.Quizzes);
        Users = new UserRepository(_dbContext.Users);
        Images = new ImageRepository(_dbContext.Images);
        Tags = new TagRepository(_dbContext.Tags);
        Statistics = new StatisticRepository(_dbContext.Statistics);
    }

    public IQuizRepository Quizzes { get; }
    public IUserRepository Users { get; }
    public IImageRepository Images { get; }
    public ITagRepository Tags { get; }
    public IStatisticRepository Statistics { get;}
}