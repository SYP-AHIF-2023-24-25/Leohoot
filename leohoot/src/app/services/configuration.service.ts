import { Injectable } from '@angular/core';
import { Quiz } from '../model/quiz';
import { Question } from '../model/question';
import { QuestionComponent } from '../components/question/question.component';
@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {
  quiz: Quiz = {
    title: "",
    description: "",
    creator: "sampleUser",
    questions: [],
    imageName: ""
  };

  updateQuestion(question: Question) {
      this.quiz.questions[question.questionNumber - 1] = question;
    
  }

  addQuestion(question: Question) {
    question.questionNumber = this.quiz.questions.length + 1;
    this.quiz.questions.push(question);
  }

  addImage(imageName: string) {
    this.quiz.imageName = imageName;
  }

  getQuiz() {
    return this.quiz;
  }

  getQuestions() {
    return this.quiz.questions;
  }

  setQuizTitleAndDescription(quizTitle: string, quizDescription: string, imageUrl: string) {
    this.quiz.title = quizTitle;
    this.quiz.description = quizDescription;
  }

  setQuiz(quiz: Quiz) {
    this.quiz.title = quiz.title;
    this.quiz.description = quiz.description;
    this.quiz.questions = quiz.questions;
    this.quiz.imageName = quiz.imageName;
  }

  deleteQuestion(questionId: number) {
    this.quiz.questions = this.quiz.questions.filter(question => question.questionNumber !== questionId);
    this.quiz.questions.forEach((question, index) => {
      question.questionNumber = index + 1;
    });
  }
}
