import { QuestionTeacher } from './question-teacher';

export interface Quiz {
  title: string;
  description: string;
  questions: QuestionTeacher[];
  creator: string;
  imageName: string;
}
