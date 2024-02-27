import { Injectable } from '@angular/core';
import { Quiz } from '../model/quiz';
import { Question } from '../model/question';
import { QuestionComponent } from '../components/question/question.component';
@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {
  quiz: Quiz = {
    creator: "",
    description: "",
    questions: [],
    title: "",
    id: 0
  };

  updateQuestion(question: Question) {
      this.quiz.questions[question.questionNumber] = question;
    
  }

  addQuestion(question: Question) {
    question.questionNumber = this.quiz.questions.length;
    this.quiz.questions.push(question);
  }

  getQuiz() {
    return this.quiz;
  }

  getQuestions() {
    return this.quiz.questions;
  }

  setQuiz(quizTitle: string, quizDescription: string) {
    this.quiz.title = quizTitle;
    this.quiz.description = quizDescription;
  }

  deleteQuestion(questionId: number) {
    this.quiz.questions = this.quiz.questions.filter(question => question.questionNumber !== questionId);
    this.quiz.questions.forEach((question, index) => {
      question.questionNumber = index;
    });
  }

}
