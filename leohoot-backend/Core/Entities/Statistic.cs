using System.ComponentModel.DataAnnotations;
using Base.Core.Entities;

namespace Core.Entities;

public class Statistic: EntityObject
{
    public DateTime StartTime { get; set; }
    public DateTime EndTime { get; set; }
    public int StudentsCount { get; set; }
    [MaxLength(256)]
    public required string QuizName { get; set; }
    public List<StatisticQuestion> Questions { get; set; } = [];
}