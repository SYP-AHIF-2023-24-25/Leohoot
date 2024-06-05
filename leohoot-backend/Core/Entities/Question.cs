using System;
using System.ComponentModel.DataAnnotations;
using Base.Core.Entities;

namespace Core.Entities;

public class Question: EntityObject
{
        public int QuizId { get; set; }
        public Quiz? Quiz { get; set; }
        public int QuestionNumber { get; set; }
        [MaxLength(256)]
        public required string QuestionText { get; set; }
        public int AnswerTimeInSeconds { get; set; }
        public List<Answer> Answers { get; set; } = [];
        [MaxLength(256)]
        public string? ImageName { get; set; }
        public int PreviewTime { get; set; }
        [MaxLength(256)]
        public string? Snapshot { get; set; }
        public bool? ShowMultipleChoice { get; set; }
}