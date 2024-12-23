using Base.Core.Entities;

namespace Core.Entities;

public class StatisticAnswers: EntityObject
{
    public required string AnswerText { get; set; }
    public List<string> UserNames { get; set; } = [];
    public bool IsCorrect { get; set; }
    public int QuestionId { get; set; }
    public StatisticQuestion? Question { get; set; }
}