using System;

public class Answer{
        public string AnswerText { get; }
        public bool IsCorrect { get; }

        public Answer(string answer, bool isCorrect) {
            this.AnswerText = answer;
            this.IsCorrect = isCorrect;
        }
}