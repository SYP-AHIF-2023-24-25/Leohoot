import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loading-screen',
  standalone: true,
  imports: [],
  templateUrl: './loading-screen.component.html'
})
export class LoadingScreenComponent {
  @Input() isLoading: boolean = true;
  @Input() loadingText: string = "Loading...";
}
