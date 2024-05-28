import {Component, input, InputFunction} from '@angular/core';
import {QuestionTeacher} from "../../../model/question-teacher";
import {Subscription} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {RestService} from "../../../services/rest.service";
import {SignalRService} from "../../../services/signalr.service";
import {Quiz} from "../../../model/quiz";
import { ConfigurationService } from 'src/app/services/configuration.service';
import { KeycloakService } from 'keycloak-angular';
import { LoginService } from 'src/app/services/auth.service';
import { log } from 'console';

@Component({
  selector: 'app-quiz-overview',
  templateUrl: './quiz-overview.component.html',
  styleUrls: []
})
export class QuizOverviewComponent {
  quizzes: Quiz[] = [];
  filteredQuizzes: Quiz[] = [];
  isDropdownOpen = false;
  loggedIn = () => this.loginService.isLoggedIn();
  protected readonly input = input;

  constructor(private router: Router, private restservice: RestService, private signalRService: SignalRService, private loginService: LoginService) {
    console.log(this.loginService.getToken());
  }

  async ngOnInit() {
    if (this.loginService.isLoggedIn()){
      this.restservice.getAllQuizzes().subscribe((data) => {
        this.quizzes = data;
        this.filteredQuizzes = this.quizzes;
      });
    }
  }

  async login(loginWithKeycloak: boolean) {
    await this.loginService.login(loginWithKeycloak);
  }

  async logout() {
    await this.loginService.logout();
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

  search(input: string) {
    if (!input) {
      this.filteredQuizzes = this.quizzes;
      return;
    }

    this.filteredQuizzes = this.quizzes.filter(
      quiz => quiz?.title.toLowerCase().includes(input.toLowerCase()) || quiz?.description.toLowerCase().includes(input.toLowerCase())
    );
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }
}
