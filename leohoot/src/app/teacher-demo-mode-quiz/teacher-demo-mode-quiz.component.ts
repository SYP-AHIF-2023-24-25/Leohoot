import { Component } from '@angular/core';
import { Answer } from 'src/model/answer';
import { DemoQuiz } from 'src/model/demo-quiz';
import { Question } from 'src/model/question';
import { Subscription, timer } from 'rxjs';

@Component({
  selector: 'app-teacher-demo-mode-quiz',
  templateUrl: './teacher-demo-mode-quiz.component.html',
  styleUrls: ['./teacher-demo-mode-quiz.component.css']
})
export class TeacherDemoModeQuizComponent {
  currentQuestionIndex = 0;
  demoQuiz: DemoQuiz;
  colors = [ "bg-hooti-orange", "bg-hooti-yellow", "bg-hooti-green", "bg-hooti-blue"];
  currTime: number = 0;
  obsTimer: Subscription = new Subscription();
  questionIsFinished: boolean = false;

  constructor() {
    this.demoQuiz = new DemoQuiz("Demo Quiz", "This is a demo quiz", [
      new Question("What is the capital of France?", 15, [
        new Answer("Lyon", false),
        new Answer("Paris", true),
        new Answer("Marseille", false),
        new Answer("St. Tropez", false)], "assets/images/panorama.jpg"),
      new Question("Is Syp cool?", 10, [
          new Answer("true", true),
          new Answer("false", false)]),
      new Question("Which animals are in our mascot?", 20, [
        new Answer("Lion", true),
        new Answer("Chicken", false),
        new Answer("Cat", false),
        new Answer("Owl", true)], "assets/images/hooti.png"),
      new Question("Du bist Busfahrer. An der 1. Haltestelle steigen 5 Gäste ein. An der 2. Haltestelle steigen 3 Leute zu und 2 aus. An der 3. Haltestelle steigen 4 ein und 5 aus. Wie alt ist der Busfahrer?", 30, [
        new Answer("18, er ist Fahranfänger", false),
        new Answer("Der Busfahrer existiert gar nicht", false),
        new Answer("Du bist der Busfahrer", true),
        new Answer("über 90, er hat den Führerschein in seinen jungen Jahren gemacht", false)]),
      new Question("Wie heißt Pippi Langstrumpfs Affe?", 15, [
        new Answer("Herr Peterson", false),
        new Answer("Nils Holgerson", false),
        new Answer("Herr Nilsson", true)], "assets/images/herr-nilsson.jpg")]
    , "Hooti");
  }

  ngOnInit() {
    this.startTimer();
  }

  startTimer() {
    this.obsTimer = timer(0, 1000).subscribe(currTime => {
      if (currTime == this.demoQuiz.questions[this.currentQuestionIndex].answerTimeInSeconds) {
        this.obsTimer.unsubscribe();
        this.questionIsFinished = true;
      }
      this.currTime = currTime
    });
  }

  showCorrectAnswer() {
    this.questionIsFinished = true;
    this.obsTimer.unsubscribe();
  }

  nextQuestion() {
    if (this.currentQuestionIndex == this.demoQuiz.questions.length - 1) {
      alert("Quiz is finished");
    } else {
      this.currentQuestionIndex++;
      this.questionIsFinished = false;
      this.startTimer();
    }
  }
}
