import { Component, Input } from "@angular/core";

@Component({
  selector: 'app-countdown',
  templateUrl: './countdown.component.html',
})
export class CountdownComponent {
  @Input() time: number = 0;
}
