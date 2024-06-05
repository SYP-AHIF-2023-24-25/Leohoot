using System.ComponentModel.DataAnnotations;
using Base.Core.Entities;

namespace Core.Entities;
public class Answer: EntityObject
{
    [MaxLength(256)]
    public required string AnswerText { get; set; }
    public bool IsCorrect { get; set; }
    public int QuestionId { get; set; }
    public Question? Question { get; set; }
}