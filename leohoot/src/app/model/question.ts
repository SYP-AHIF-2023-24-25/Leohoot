import { Answer } from './answer';

export interface Question {
  id: number;
  questionText: string;
  questionNumber: number;
  previewTime: number;
  answerTimeInSeconds: number;
  answers: Answer[];
  imageName?: string;
  nextQuestionId: number | null;
}
