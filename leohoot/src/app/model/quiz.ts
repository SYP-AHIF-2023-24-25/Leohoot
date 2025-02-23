import { QuestionTeacher } from './question-teacher';
import { Tag } from './tag';

export interface Quiz {
  title: string;
  description: string;
  questions: QuestionTeacher[];
  tags: Tag[];
  creator: string;
  imageName: string;
  isPublic: boolean;
  isFavorited: boolean;
  id?: number;
}
