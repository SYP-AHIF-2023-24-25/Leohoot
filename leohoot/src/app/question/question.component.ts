import { Component } from '@angular/core';
import { Question } from 'src/model/question';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.css']
})
export class QuestionComponent {
  question: Question;

  constructor(question: Question) {
    this.question = question
  }
}
