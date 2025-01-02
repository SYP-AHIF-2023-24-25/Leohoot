export interface Chart {
  questionNumber: number;
  questionText: string;
  totalAnswers: number;
  correctAnswers: number;
  incorrectAnswers: number;
  notGivenAnswers: number;
  correctAnswersInPercentage: number;
  incorrectAnswersInPercentage: number;
  notGivenAnswersInPercentage: number;
}
