
using Base.Core.Entities;

namespace Core.Entities;

public class FavoriteQuizzes : EntityObject
{
    public int UserId { get; set; }
    public User? User { get; set; }

    public int QuizId { get; set; }
    public Quiz? Quiz { get; set; }

    public DateTime FavoritedAt { get; set; } = DateTime.UtcNow;
}