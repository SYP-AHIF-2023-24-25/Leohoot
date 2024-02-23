import { Answer } from './answer';

export interface Question {
  questionNumber: number;
  questionText: string;
  answerTimeInSeconds: number;
  imageName?: string;
  previewTime: number;
  answers: Answer[];
  quizLength: number;
}
