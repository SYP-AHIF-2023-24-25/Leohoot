import { Component, Input } from '@angular/core';
import { Quiz } from 'src/app/model/quiz';

@Component({
  selector: 'app-quiz-quizmaker',
  templateUrl: './quiz-quizmaker.component.html'
})
export class QuizQuizmakerComponent {
  quizTitle: string = '';
  description: string = '';
  quiz: Quiz | undefined;
  @Input() quizId: string = "";

  @Input()
  set newQuiz(value: Quiz | undefined) {
    this.quiz = value;
   
    if (value) {
      this.quizTitle = value.title || '';
      this.description = value.description || '';
    }
  }

  updateQuizTitle(title: string) {
    if (this.quiz) {
      this.quiz.title = title;
    }
    console.log(this.quiz);
  }

  updateQuizDescription(desc: string) {
    if (this.quiz) {
      this.quiz.description = desc;
    }
  }

  playDemoMode() {
    // Your play demo logic
  }
}

