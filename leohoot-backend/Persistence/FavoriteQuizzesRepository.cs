
using Base.Persistence;
using Core.Contracts;
using Core.Entities;
using Microsoft.EntityFrameworkCore;

namespace Persistence;

public class FavoriteQuizzesRepository: GenericRepository<FavoriteQuizzes>, IFavoriteQuizzesRepository
{
    private readonly DbSet<FavoriteQuizzes> _favoriteQuizzes;

    public FavoriteQuizzesRepository(DbSet<FavoriteQuizzes> favoriteQuizzes): base(favoriteQuizzes)
    {
        _favoriteQuizzes = favoriteQuizzes;
    }

    public async Task<FavoriteQuizzes?> GetFavoriteQuizdAsync(int userId, int quizId)
    {
        return await _favoriteQuizzes
            .Where(fq => fq.UserId == userId && fq.QuizId == quizId)
            .FirstOrDefaultAsync();
    }
}