import { Component, Input } from '@angular/core';
import { Quiz } from 'src/app/model/quiz';

@Component({
  selector: 'app-sidebar-quizmaker',
  templateUrl: './sidebar-quizmaker.component.html',
  styleUrls: ['./sidebar-quizmaker.component.css']
})
export class SidebarQuizmakerComponent {
  quiz: Quiz | undefined;

  @Input() quizId: number = 0;

  @Input()
  set newQuiz(value: Quiz | undefined) {
    this.quiz = value;
  }
}
