import { Question } from "./question";

export interface StudentViewData{
    question: Question,
    points: number,
    quizLength: number,
    currentPoints: number
}