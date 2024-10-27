import {Component, input} from '@angular/core';
import {Router} from "@angular/router";
import {RestService} from "../../../services/rest.service";
import {SignalRService} from "../../../services/signalr.service";
import {Quiz} from "../../../model/quiz";
import { LoginService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-quiz-overview',
  templateUrl: './quiz-overview.component.html',
  styleUrls: []
})
export class QuizOverviewComponent {
  quizzes: Quiz[] = [];
  filteredQuizzes: Quiz[] = [];
  loggedIn = () => this.loginService.isLoggedIn();
  protected readonly input = input;

  constructor(private router: Router, private restservice: RestService, private signalRService: SignalRService, private loginService: LoginService) {
  }

  async ngOnInit() {
    if (this.loginService.isLoggedIn()){
      this.refetchQuestions();
    }
  }

  refetchQuestions() {
    this.restservice.getAllQuizzes().subscribe((data) => {
      this.quizzes = data;
      this.filteredQuizzes = data;
    });
  }

  search(input: string) {
    if (!input) {
      this.filteredQuizzes = this.quizzes;
      return;
    }

    this.filteredQuizzes = this.quizzes.filter(
      quiz => quiz?.title.toLowerCase().includes(input.toLowerCase()) || quiz?.description.toLowerCase().includes(input.toLowerCase())
    );
  }

  setQuiz(data: Quiz[]) {
    this.filteredQuizzes = data;
    this.quizzes = data;
    console.log(this.quizzes);
  }
}
