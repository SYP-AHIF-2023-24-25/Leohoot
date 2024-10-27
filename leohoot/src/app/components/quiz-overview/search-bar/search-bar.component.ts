import { Component, Input } from "@angular/core";

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
})
export class SearchBarComponent {
  @Input() search!: (filter: string) => void;
}
