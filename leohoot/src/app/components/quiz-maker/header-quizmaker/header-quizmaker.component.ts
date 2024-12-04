import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Quiz } from 'src/app/model/quiz';
import { LoginService } from 'src/app/services/auth.service';
import { RestService } from 'src/app/services/rest.service';

@Component({
  selector: 'app-header-quizmaker',
  templateUrl: './header-quizmaker.component.html'
})
export class HeaderQuizmakerComponent {
    @Input() quiz?: Quiz;
    @Input() username: string = "";
    @Input() quizId: number = 0;
  
    isDropdownOpen: boolean = false;
  
    constructor(private router: Router, private restService: RestService, private loginService: LoginService) {
    }
  
    async editQuiz() {
      //await this.router.navigate(['/quizMaker'], { queryParams: { quizId:  this.quiz?.id, edit: true} });
    }
    async saveQuiz() {
      // if (confirm("Are you sure you want to delete this quiz?")) {
      //   this.restService.deleteQuiz(this.quiz?.id!).subscribe(() => {
      //     this.router.navigate(['/quizOverview'])
      //   });
      // }
    }
    toggleDropdown(): void {
      this.isDropdownOpen = !this.isDropdownOpen;
    }
    async logout() {
      await this.loginService.logout()
    }
}
