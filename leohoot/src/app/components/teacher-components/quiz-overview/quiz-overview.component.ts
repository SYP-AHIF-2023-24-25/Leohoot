import {Component, input, InputFunction} from '@angular/core';
import {QuestionTeacher} from "../../../model/question-teacher";
import {Subscription} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {RestService} from "../../../services/rest.service";
import {SignalRService} from "../../../services/signalr.service";
import {Quiz} from "../../../model/quiz";
import { ConfigurationService } from 'src/app/services/configuration.service';
import { KeycloakService } from 'keycloak-angular';

@Component({
  selector: 'app-quiz-overview',
  templateUrl: './quiz-overview.component.html',
  styleUrls: []
})
export class QuizOverviewComponent {
  quizzes: Quiz[] = [];
  filteredQuizzes: Quiz[] = [];
  loggedIn: boolean = false;

  constructor(private router: Router, private restservice: RestService, private keycloakService: KeycloakService, private signalRService: SignalRService) {
  }

  async ngOnInit() {
    this.loggedIn = this.keycloakService.isLoggedIn()

    if (this.loggedIn)
    {
      this.restservice.getAllQuizzes().subscribe((data) => {
        this.quizzes = data;
        this.filteredQuizzes = this.quizzes;
      });
    }
  }

  async login() {
    console.log("login")
    if (this.keycloakService.isLoggedIn() == false)
    {
      await this.keycloakService.login();
    }

  }

  async logout(): Promise<void> {
    if (this.loggedIn) {
      await this.keycloakService.logout();
    }
    this.loggedIn = this.keycloakService.isLoggedIn()
  }

  goToWaitingroom(quizId: number) {
    this.router.navigate(['/waitingroom'], { queryParams: { quizId:  quizId} });
  }

  goToQuizMaker(quizId: number) {
    this.router.navigate(['/quizMaker'], { queryParams: { quizId:  quizId} });
  }

  deleteQuiz(quizId: number) {
    this.restservice.deleteQuiz(quizId).subscribe(() => {
      location.reload();
    });
  }

  protected readonly input = input;

  search(input: string) {
    if (!input) {
      this.filteredQuizzes = this.quizzes;
      return;
    }

    this.filteredQuizzes = this.quizzes.filter(
      quiz => quiz?.title.toLowerCase().includes(input.toLowerCase()) || quiz?.description.toLowerCase().includes(input.toLowerCase())
    );
  }
}
