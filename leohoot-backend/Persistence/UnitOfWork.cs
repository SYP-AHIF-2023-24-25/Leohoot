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
    }

    public IQuizRepository Quizzes { get; }
    public IUserRepository Users { get; }
    public IImageRepository Images { get; }
}