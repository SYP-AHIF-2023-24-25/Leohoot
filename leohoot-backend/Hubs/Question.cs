using System;

public class Question {
        public int Id { get; }
        public string QuestionText { get; }
        public int AnswerTimeInSeconds { get; }
        public List<Answer> Answers { get; }
        public string ImageName { get; }

       public Question(int id, string question, int answerTimeInSeconds, List<Answer> answers, string imageName) {
           this.Id = id;
           this.QuestionText = question;
           this.AnswerTimeInSeconds = answerTimeInSeconds;
           this.Answers = answers;
           this.ImageName = imageName;
       }

       public Question(int id, string question, int answerTimeInSeconds, List<Answer> answers): this(id, question, answerTimeInSeconds, answers, null) {

       }

}