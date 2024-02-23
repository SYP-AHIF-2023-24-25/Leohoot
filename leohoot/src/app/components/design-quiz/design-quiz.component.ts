import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { RestService } from 'src/app/services/rest.service';
import { SignalRService } from 'src/app/services/signalr.service';

@Component({
  selector: 'app-design-quiz',
  templateUrl: './design-quiz.component.html'
})
export class DesignQuizComponent {
  showError: boolean = false;
  name: string | undefined;
  description: string | undefined;
  
  constructor(private restService: RestService, private router: Router, private route: ActivatedRoute, private signalRService: SignalRService) {
  }

  addQuestion() {
    this.router.navigate(['/designQuestion']);
  }
}
