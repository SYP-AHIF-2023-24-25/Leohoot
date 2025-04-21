import { Component, Input } from "@angular/core";

@Component({
  selector: 'app-game-infos',
  templateUrl: './game-infos.component.html',
})
export class GameInfosComponent {
  @Input() gamePin: number = 0;
  @Input() environment: string = "";

}
