import { Component, Input } from "@angular/core";

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
})
export class FooterComponent {
  @Input() questionNumber: number = 0;
  @Input() quizLength: number = 0;
}
