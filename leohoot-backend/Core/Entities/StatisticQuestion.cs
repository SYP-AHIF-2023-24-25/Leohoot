using Base.Core.Entities;

namespace Core.Entities;

public class StatisticQuestion: EntityObject
{
    public int QuestionNumber { get; set; }
    public required string QuestionText { get; set; }
    public List<StatisticAnswers> Answers { get; set; } = [];
    public int StatisticId { get; set; }
    public Statistic? Statistic { get; set; }
}