import { Injectable } from '@angular/core';
import { Quiz } from '../model/quiz';
import { QuestionTeacher } from '../model/question-teacher';
import { QuestionComponent } from '../components/teacher-components/question/question.component';
import { LoginService } from './auth.service';
import { Tag } from '../model/tag';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {
  constructor(private loginService: LoginService) { }
  quiz: Quiz = {
    title: "",
    description: "",
    creator: this.loginService.getUserName(),
    questions: [],
    imageName: "",
    tags: []
  };

  updateQuestion(question: QuestionTeacher) {
      this.quiz.questions[question.questionNumber - 1] = question;
  }

  changeOrderOfQuestions(newOrderOfQuestions: QuestionTeacher[]){
    this.quiz.questions = newOrderOfQuestions;
  }

  addQuestion(question: QuestionTeacher) {
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

  setQuizTitleDescriptionAndTags(quizTitle: string, quizDescription: string, quizTags: Tag[]) {
    this.quiz.title = quizTitle;
    this.quiz.description = quizDescription;
    this.quiz.tags = quizTags;
  }

  setQuiz(quiz: Quiz) {
    this.quiz.title = quiz.title;
    this.quiz.description = quiz.description;
    this.quiz.questions = quiz.questions;
    this.quiz.imageName = quiz.imageName;
    this.quiz.tags = quiz.tags;
  }

  deleteQuestion(questionId: number) {
    this.quiz.questions = this.quiz.questions.filter(question => question.questionNumber !== questionId);
    this.quiz.questions.forEach((question, index) => {
      question.questionNumber = index + 1;
    });
  }

  clearQuiz() {
    this.quiz = {
      title: "",
      description: "",
      creator: "sampleUser",
      questions: [],
      imageName: "",
      tags: []
    };
  }
}
