import { Component, Input } from "@angular/core";
import { Ranking } from "../../../model/ranking";

@Component({
  selector: 'app-ranking-list',
  templateUrl: './ranking-list.component.html',
})
export class RankingListComponent {
  @Input() ranking!: Ranking;
}
