import { Component, Input } from "@angular/core";
import { Quiz } from "../../../model/quiz";
import { RestService } from "../../../services/rest.service";
import { Router } from "@angular/router";
import { LoginService } from "src/app/services/auth.service";

@Component({
  selector: 'app-quiz-card',
  templateUrl: './quiz-card.component.html',
})
export class QuizCardComponent {
  @Input() quiz!: Quiz;
  @Input() setQuiz!: (data: Quiz[]) => void;
  ownQuiz: boolean = false;
  username: string;

  constructor(private restservice: RestService, private router: Router, private loginService: LoginService) {
    this.username = this.loginService.getUserName();
  }

  ngOnInit() {
    if (this.quiz && this.quiz.creator === this.username) {
      this.ownQuiz = true;
    }
  }

  async goToWaitingroom(quizId: number) {
    await this.router.navigate(['/waitingroom'], { queryParams: { quizId:  quizId } });
  }
  async goToQuizMaker(quizId: number) {
    await this.router.navigate(['/quizMaker'], { queryParams: { quizId:  quizId, edit: true} });
  }
  deleteQuiz(quizId: number) {
    if (confirm("Are you sure you want to delete this quiz?")) {
      this.restservice.deleteQuiz(quizId).subscribe(() => {
        this.restservice.getAllQuizzes().subscribe((data) => {
          this.setQuiz(data)
        });
      });
    } 
  }
}
