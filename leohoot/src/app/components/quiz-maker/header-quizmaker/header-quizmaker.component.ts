import { Component, EventEmitter, Input, Output } from '@angular/core';
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
    @Input() quizId: number = -1;

    @Output() saveQuiz = new EventEmitter<string>();
  
    isDropdownOpen: boolean = false;
  
    constructor(private router: Router, private restService: RestService, private loginService: LoginService) {
    }
  
    async editQuiz() {
      //await this.router.navigate(['/quizMaker'], { queryParams: { quizId:  this.quiz?.id, edit: true} });
    }
    async save() {
      if(this.quizId === -1){
        if (this.quiz?.title === '' || this.quiz?.description === '') {
          alert('Please enter a title and description for the quiz.');
          return;
        }
        this.saveQuiz.emit('saveQuiz');
      }
    }
    toggleDropdown(): void {
      this.isDropdownOpen = !this.isDropdownOpen;
    }
    async logout() {
      await this.loginService.logout()
    }
}
