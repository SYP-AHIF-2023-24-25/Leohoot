namespace LeohootBackend.Model;
public class Answer{
        public int AnswerId { get; set; }
        public required string AnswerText { get; set; }
        public bool IsCorrect { get; set; }
}