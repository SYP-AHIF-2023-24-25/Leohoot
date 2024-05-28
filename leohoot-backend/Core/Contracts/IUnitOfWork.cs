namespace Core.Contracts;

using Base.Core.Contracts;

public interface IUnitOfWork : IBaseUnitOfWork
{
    IQuizRepository Quizzes { get; }
    IUserRepository Users { get; }
    IImageRepository Images { get; }
    ITagRepository Tags { get; }
}