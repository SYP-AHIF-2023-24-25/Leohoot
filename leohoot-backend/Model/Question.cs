using System;
namespace LeohootBackend.Model;

public class Question {
        public int QuestionId { get; set; }
        public required string QuestionText { get; set; }
        public required int AnswerTimeInSeconds { get; set;}
        public required List<Answer> Answers { get; set;}
        public string? ImageName { get; set;}
        public required int PreviewTime { get; set; }
        public Question? NextQuestion { get; set; }

}