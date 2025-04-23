import { Component, Input } from "@angular/core";
import { Quiz } from "../../../model/quiz";
import { Router } from "@angular/router";
import { RestService } from "../../../services/rest.service";
import { LoginService } from "../../../services/auth.service";
import { AlertService } from "src/app/services/alert.service";

@Component({
  selector: 'app-header-details',
  templateUrl: './header-details.component.html',
})
export class HeaderDetailsComponent {
  @Input() quiz?: Quiz;
  @Input() username: string = "";
  @Input() toggleSidebar?: () => void;

  isDropdownOpen: boolean = false;

  constructor(private router: Router, private restService: RestService, private loginService: LoginService, private alertService: AlertService) {
  }

  async editQuiz() {
    await this.router.navigate(['/quizMaker'], { queryParams: { quizId:  this.quiz?.id, edit: true} });
  }
  async deleteQuiz() {
    this.alertService.confirm('Are you sure you want to delete this quiz?')
    .then(confirmed => {
      if (confirmed) {
        this.restService.deleteQuiz(this.quiz?.id!).subscribe(() => {
          this.router.navigate(['/dashboard'])
        });
      }
    });
  }
  async duplicateQuiz() {
    this.alertService.confirm('Are you sure you want to duplicate this quiz?')
    .then(confirmed => {
      if (confirmed) {
        const quizClone = this.quiz;
      if (quizClone) {
        quizClone.id = undefined;
        quizClone.creator = this.username;
        this.restService.addQuiz(quizClone).subscribe((id) => {
          this.router.navigate(['/quizDetails'], { queryParams: { quizId:  id } });
        })
      }
      } 
    });
  }
  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }
  async logout() {
    await this.loginService.logout()
  }

  unfavoriteQuiz() {
    this.restService.unfavoriteQuiz(this.quiz?.id!, this.username).subscribe((data) => {
      this.restService.getQuizById(this.quiz?.id!).subscribe((quiz) => {
        this.quiz = quiz;
      });
    });
  }

  favoriteQuiz() {
    this.restService.favoriteQuiz(this.quiz?.id!, this.username).subscribe((data) => {
      this.restService.getQuizById(this.quiz?.id!).subscribe((quiz) => {
        this.quiz = quiz;
      });
    });
  }
}
