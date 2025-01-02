import { Component, Input } from "@angular/core";
import { Quiz } from "../../../model/quiz";
import { Router } from "@angular/router";
import { RestService } from "../../../services/rest.service";
import { LoginService } from "../../../services/auth.service";

@Component({
  selector: 'app-header-details',
  templateUrl: './header-details.component.html',
})
export class HeaderDetailsComponent {
  @Input() quiz?: Quiz;
  @Input() username: string = "";

  isDropdownOpen: boolean = false;

  constructor(private router: Router, private restService: RestService, private loginService: LoginService) {
  }

  async editQuiz() {
    await this.router.navigate(['/quizMaker'], { queryParams: { quizId:  this.quiz?.id, edit: true} });
  }
  async deleteQuiz() {
    if (confirm("Are you sure you want to delete this quiz?")) {
      this.restService.deleteQuiz(this.quiz?.id!).subscribe(() => {
        this.router.navigate(['/dashboard'])
      });
    }
  }
  async duplicateQuiz() {
    if (confirm("Are you sure you want to duplicate this quiz?")) {
      const quizClone = this.quiz;
      if (quizClone) {
        quizClone.id = undefined;
        quizClone.creator = this.username;
        this.restService.addQuiz(quizClone).subscribe((id) => {
          this.router.navigate(['/quizDetails'], { queryParams: { quizId:  id } });
        })
      }
    }
  }
  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }
  async logout() {
    await this.loginService.logout()
  }
}
