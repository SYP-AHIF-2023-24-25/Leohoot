import { Component, Input } from "@angular/core";

@Component({
  selector: 'app-date-range-filter',
  templateUrl: './date-range-filter.component.html',
})
export class DateRangeFilterComponent {
  @Input() startDate: string | null = null;
  @Input() endDate: string | null = null;
  @Input() quizName: string = "";

  @Input() onFilterChanged?: (quizName: string, startDate: string | null, endDate: string | null) => void
}
