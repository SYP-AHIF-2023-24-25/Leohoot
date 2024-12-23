using Base.Core.Entities;

namespace Core.Entities;

public class Statistic: EntityObject
{
    public DateTime StartTime { get; set; }
    public int StudentsCount { get; set; }
    public required string QuizName { get; set; }
    public List<StatisticQuestion> Questions { get; set; } = [];
}