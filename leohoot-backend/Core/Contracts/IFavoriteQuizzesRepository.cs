
using Base.Core.Contracts;
using Core.Entities;

namespace Core.Contracts;

public interface IFavoriteQuizzesRepository: IGenericRepository<FavoriteQuizzes>
{
    public Task<FavoriteQuizzes?> GetFavoriteQuizdAsync(string username, int quizId);
}