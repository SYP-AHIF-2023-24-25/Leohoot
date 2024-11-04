import { Component, Input } from "@angular/core";
import { QuestionStudent } from "../../../model/question-student";

@Component({
  selector: 'app-header-student',
  templateUrl: './header-student.component.html',
})
export class HeaderStudentComponent {
  @Input() title: string = "";
  @Input() showQuestion?: () => void;
}
