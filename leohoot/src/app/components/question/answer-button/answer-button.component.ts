import { Component, Input } from "@angular/core";
import { Answer } from "../../../model/answer";

@Component({
  selector: 'app-answer-button',
  templateUrl: './answer-button.component.html',
})
export class AnswerButtonComponent {
  @Input() questionIsFinished: boolean = false;
  @Input() answer?: Answer
  @Input() answerIndex: number = 0;
  @Input() answerCounts?: number[]

  colors = [
    'bg-button-yellow',
    'bg-green-400',
    'bg-rose-400',
    'bg-blue-400',
  ];

  icons = [
    'assets/images/cat.png',
    'assets/images/frog.png',
    'assets/images/crab.png',
    'assets/images/bird.png'
  ];
}
