
using Base.Core.Contracts;
using Core.Entities;

namespace Core.Contracts;

public interface IFavoriteQuizzesRepository: IGenericRepository<FavoriteQuizzes>
{
    Task<FavoriteQuizzes?> GetFavoriteQuizdAsync(int userId, int quizId);
}