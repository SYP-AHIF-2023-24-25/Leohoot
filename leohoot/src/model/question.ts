import { Answer } from './answer';

export interface Question {
  id: number;
  question: string;
  answerTimeInSeconds: number;
  answers: Answer[];
  imageName?: string;
  nextQuestionId: number | null;
}
