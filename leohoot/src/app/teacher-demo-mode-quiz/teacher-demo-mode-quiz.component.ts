import { Component } from '@angular/core';

import { Quiz } from 'src/model/quiz';
import { Mode } from 'src/model/mode';

@Component({
  selector: 'app-teacher-demo-mode-quiz',
  templateUrl: './teacher-demo-mode-quiz.component.html',
  styleUrls: ['./teacher-demo-mode-quiz.component.css'],
})
export class TeacherDemoModeQuizComponent {
  constructor() {
    //localStorage.setItem('mode', Mode.TEACHER_DEMO_MODE.toString());
    //localStorage.setItem('currentQuestion', JSON.stringify(this.demoQuiz.firstQuestion));
  }
}
