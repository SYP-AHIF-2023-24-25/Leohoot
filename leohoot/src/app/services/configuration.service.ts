import { Injectable } from '@angular/core';
import { Quiz } from '../model/quiz';
import { Question } from '../model/question';
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
    let oldQuestion = this.quiz.questions.find(q => q.questionText === question.questionText);
    let indexToUpdate = oldQuestion ? this.quiz.questions.indexOf(oldQuestion) : -1;

    console.log("indexToUpdate: " + indexToUpdate);
    console.log(this.quiz.questions);

    if (indexToUpdate === -1) {
      this.quiz.questions.push(question);
    } else {
      this.quiz.questions[indexToUpdate] = question;
    }
  }

  addQuestion(question: Question) {
    this.quiz.questions.push(question);
  }

  getQuiz() {
    return this.quiz;
  }

  getQuestions() {
    return this.quiz.questions;
  }

  resetQuiz() {
    this.quiz.creator = "test";
    this.quiz.description = "";
    this.quiz.questions = [];
    this.quiz.title = "";
  }

  setQuiz(quizTitle: string, quizDescription: string) {
    this.quiz.title = quizTitle;
    this.quiz.description = quizDescription;
  }

  deleteQuestion(questionText: string) {
    this.quiz.questions = this.quiz.questions.filter(question => question.questionText !== questionText);
  }

}
