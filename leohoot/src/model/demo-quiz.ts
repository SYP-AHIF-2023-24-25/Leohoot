import { Question } from './question';

export interface DemoQuiz {
  title: string;
  description: string;
  questions: Question[];
  creator: string;
}
