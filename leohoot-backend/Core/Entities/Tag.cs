using Base.Core.Entities;

namespace Core.Entities;
public class Tag: EntityObject
{
    public required string Name { get; set; }

    public List<Quiz> Quizzes { get; set; } = [];
}