import { Answer } from './answer';

export interface QuestionTeacher {
  questionNumber: number;
  questionText: string;
  answerTimeInSeconds: number;
  imageName?: string;
  snapshot?: string;
  previewTime: number;
  answers: Answer[];
  showMultipleChoice?: boolean;
  quizLength?: number;
}
