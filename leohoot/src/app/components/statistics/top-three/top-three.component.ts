import { Component, Input } from "@angular/core";
import { Statistic } from "../../../model/statistic";

@Component({
  selector: 'app-top-three',
  templateUrl: './top-three.component.html',
})
export class TopThreeComponent {
  @Input() statistic!: Statistic;
}
