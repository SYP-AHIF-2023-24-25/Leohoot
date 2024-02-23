import { Question } from "./question";

//record QuestionStudentDto(int QuestionNumber, string QuestionText, int CurrentPoints, int QuizLength);
export interface StudentViewData{
    questionNumber: number;
    questionText: string;
    currentPoints: number;
    points: number;
    quizLength: number;
    numberOfAnswers: number;
}