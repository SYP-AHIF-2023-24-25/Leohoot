import { Question } from "./question";
import { Quiz } from "./quiz";

export interface Statistic {
    questionAnswers: { [key: number]: boolean[] };
    questions: Question[];
}