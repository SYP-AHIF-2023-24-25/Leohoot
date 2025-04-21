import { Component, Input } from "@angular/core";
import { Quiz } from "../../../model/quiz";
import { Router } from "@angular/router";
import { async } from "rxjs";
import { AlertService } from "src/app/services/alert.service";

@Component({
  selector: 'app-quiz-details',
  templateUrl: './quiz-details.component.html',
})
export class QuizDetailsComponent {
  protected readonly Math = Math;
  selectedQuiz?: Quiz;
  duration: number = 0;

  @Input()
  set quiz(value: Quiz | undefined) {
    this.selectedQuiz = value;
    if (this.selectedQuiz) {
      this.duration = this.calculateTotalDuration(this.selectedQuiz);
    }
  }

  constructor(private router: Router, private alertService: AlertService) { 
  }

  calculateTotalDuration(quiz: Quiz): number {
    let duration = 0;
    for (const question of quiz.questions) {
      duration += question.previewTime + question.answerTimeInSeconds;
    }
    return duration;
  }

  async startGame() {
    if (this.selectedQuiz?.questions.length === 0) {
      this.alertService.show('info', "This quiz has no questions. Please add questions to start the quiz.");
      return;
    }
    await this.router.navigate(['/waitingroom'], { queryParams: { quizId:  this.selectedQuiz?.id } });
  }
}
