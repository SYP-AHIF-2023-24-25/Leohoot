import { Component, Input } from "@angular/core";
import { QuestionTeacher } from "../../../model/question-teacher";

@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html',
})
export class QuestionsComponent {
  @Input() questions?: QuestionTeacher[]
  colors = [
    'bg-button-yellow',
    'bg-green-400',
    'bg-rose-400',
    'bg-blue-400',
  ];
}
