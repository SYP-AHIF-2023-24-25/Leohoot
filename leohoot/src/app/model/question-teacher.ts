import { Answer } from './answer';

export interface QuestionTeacher {
  questionNumber: number;
  questionText: string;
  answerTimeInSeconds: number;
  imageName?: string;
  previewTime: number;
  answers: Answer[];
  quizLength?: number;
}
