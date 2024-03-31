using System;
namespace Core;

public class Question
{
        public int Id { get; set; }
        public int QuizId { get; set; }
        public Quiz? Quiz { get; set; }
        public int QuestionNumber { get; set; }
        public string QuestionText { get; set; } = string.Empty;
        public int AnswerTimeInSeconds { get; set; }
        public List<Answer> Answers { get; set; } = new List<Answer>();
        public string? ImageName { get; set; }
        public int PreviewTime { get; set; }

}