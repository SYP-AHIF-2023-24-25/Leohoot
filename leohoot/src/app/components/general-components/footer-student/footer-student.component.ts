import { Component, Input } from "@angular/core";

@Component({
  selector: 'app-footer-student',
  templateUrl: './footer-student.component.html',
})
export class FooterStudentComponent {
  @Input() username: string = "";
  @Input() points: number = 0;
}
