using System;
namespace LeohootBackend.Model;

public class Question
{
        public int Id { get; set; }

        // Foreign key  
        public int QuizId { get; set; }
        // Navigation property
        public Quiz? Quiz { get; set; }

        public int QuestionNumber { get; set; }
        public string QuestionText { get; set; } = string.Empty;
        public int AnswerTimeInSeconds { get; set; }
        public List<Answer> Answers { get; set; } = [];
        public string? ImageName { get; set; }
        public int PreviewTime { get; set; }

}