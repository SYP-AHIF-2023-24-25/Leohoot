import { Component, Input } from "@angular/core";
import { Quiz } from "../../../model/quiz";
import { RestService } from "../../../services/rest.service";
import { Router } from "@angular/router";

@Component({
  selector: 'app-quiz-card',
  templateUrl: './quiz-card.component.html',
})
export class QuizCardComponent {
  @Input() quiz!: Quiz;
  @Input() setQuiz!: (data: Quiz[]) => void;

  constructor(private restservice: RestService, private router: Router) {
  }

  async goToWaitingroom(quizId: number) {
    await this.router.navigate(['/waitingroom'], { queryParams: { quizId:  quizId } });
  }
  async goToQuizMaker(quizId: number) {
    await this.router.navigate(['/quizMaker'], { queryParams: { quizId:  quizId, edit: true} });
  }
  deleteQuiz(quizId: number) {
    this.restservice.deleteQuiz(quizId).subscribe(() => {
      this.restservice.getAllQuizzes().subscribe((data) => {
        this.setQuiz(data)
      });
    });
  }
}
