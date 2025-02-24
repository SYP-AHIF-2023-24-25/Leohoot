
using System.ComponentModel.DataAnnotations;
using Base.Core.Entities;

namespace Core.Entities;

public class FavoriteQuizzes : EntityObject
{
    [Required]
    public string Username { get; set; }
    public int QuizId { get; set; }
    public Quiz? Quiz { get; set; }

    public DateTime FavoritedAt { get; set; } = DateTime.UtcNow;
}