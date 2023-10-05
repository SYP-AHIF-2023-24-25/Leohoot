import { Component } from '@angular/core';
import { Answer } from 'src/model/answer';
import { DemoQuiz } from 'src/model/demo-quiz';
import { Question } from 'src/model/question';

@Component({
  selector: 'app-teacher-demo-mode-quiz',
  templateUrl: './teacher-demo-mode-quiz.component.html',
  styleUrls: ['./teacher-demo-mode-quiz.component.css']
})
export class TeacherDemoModeQuizComponent {
  currentQuestionIndex = 0;

  constructor() {
    this.demoQuiz = new DemoQuiz("Demo Quiz", "This is a demo quiz", [
      new Question("What is the capital of France?", 15, [
        new Answer("Lyon", false),
        new Answer("Paris", true),
        new Answer("Marseille", false),
        new Answer("St. Tropez", false)]),
      new Question("Is Syp cool?", 10, [
          new Answer("true", true),
          new Answer("false", false)]),
      new Question("Which animals are in our mascot?", 20, [
        new Answer("Lion", true),
        new Answer("Chicken", false),
        new Answer("Cat", false),
        new Answer("Owl", true)], "assets/images/leohoot-mascot.png"),
      new Question("Du bist Busfahrer. An der 1. Haltestelle steigen 5 Gäste ein. An der 2. Haltestelle steigen 3 Leute zu und 2 aus. An der 3. Haltestelle steigen 4 ein und 5 aus. Wie alt ist der Busfahrer?", 30, [
        new Answer("18, er ist Fahranfänger", false),
        new Answer("Der Busfahrer existiert gar nicht", false),
        new Answer("Du bist der Busfahrer", true),
        new Answer("über 90, er hat den Führerschein in seinen jungen Jahren gemacht", false)]),
      new Question("Wie heißt Pippi Langstrumpfs Affe?", 15, [
        new Answer("Herr Peterson", false),
        new Answer("Nils Holgerson", false),
        new Answer("Herr Nielson", true)], "assets/images/herr-nielson.png")], "Hooti");
  }

  demoQuiz!: DemoQuiz;
}
