import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { QuestionTeacher } from 'src/app/model/question-teacher';
import { Quiz } from 'src/app/model/quiz';
import { AlertService } from 'src/app/services/alert.service';
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
    @Input() question:QuestionTeacher = {
      questionText: 'New Question',
      answerTimeInSeconds: 0,
      previewTime: 0,
      answers: [],
      questionNumber: 0,
      imageName: undefined,
      snapshot: undefined,
      showMultipleChoice: false
    };

    @Input() editMode: boolean = false;
    @Input() savedQuiz: boolean = false;
    
    @Output() changeEditMode = new EventEmitter<void>();
    @Output() saveQuiz = new EventEmitter<string>();
  
    isDropdownOpen: boolean = false;
  
    constructor(private router: Router, private alertService: AlertService, private loginService: LoginService) {
    }
  
    editQuiz() {
      console.log('editQuiz');
      this.changeEditMode.emit();     
    }
    async save() {
      if(this.quizId === -1){
        if (this.quiz?.title === '' || this.quiz?.description === '') {
          this.alertService.show('info', "Please enter a title and description for the quiz.");
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
