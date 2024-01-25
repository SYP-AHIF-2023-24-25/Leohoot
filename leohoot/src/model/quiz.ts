import { Question } from './question';

export interface Quiz {
  title: string;
  description: string;
  questions: Question[];
  creator: string;
}
