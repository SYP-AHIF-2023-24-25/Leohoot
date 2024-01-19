using System;

namespace LeohootBackend.Model;

public class Quiz
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public int CreatorId { get; set; }
    public User? Creator { get; set; }
    public List<Question> Questions { get; set; } = [];
}