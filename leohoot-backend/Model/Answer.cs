namespace LeohootBackend.Model;
public class Answer{
        public required int AnswerId { get; set; }
        public required string AnswerText { get; set; }
        public bool IsCorrect { get; set; }
}