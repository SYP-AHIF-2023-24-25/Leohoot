using System;

namespace LeohootBackend.Model;

public class Quiz
{
    public int QuizId { get; set; }
    public required string Title { get; set; }
    public required string Description { get; set;}
    public required string UsernameCreator { get; set; }
    public required User Creator { get; set; }
    public required List<Question> Questions { get; set; }
}