import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Quiz } from 'src/app/model/quiz';

@Component({
  selector: 'app-sidebar-quizmaker',
  templateUrl: './sidebar-quizmaker.component.html',
  styleUrls: ['./sidebar-quizmaker.component.css']
})
export class SidebarQuizmakerComponent {
  quiz: Quiz | undefined;

  @Input() quizId: number = -1;

  @Input()
  set newQuiz(value: Quiz | undefined) {
    this.quiz = value;
  }

  @Output() saveQuiz = new EventEmitter<string>();

  addQuestion(){
    //quiz not saved to db yet
    if(this.quizId === -1){
      this.saveQuiz.emit('saveQuiz');
    }
    
  }
}
