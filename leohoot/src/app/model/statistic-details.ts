export interface StatisticDetails {
  startTime: Date,
  endTime: Date,
  studentsCount: number,
  quizName: string,
  quizId: number,
  questions: {
    questionNumber: number;
    questionText: string;
    answers: {
      answerText: string;
      userNames: string[];
      isCorrect: boolean;
    }
  }
}
