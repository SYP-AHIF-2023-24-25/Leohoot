import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { RestService } from 'src/app/services/rest.service';
import { SignalRService } from 'src/app/services/signalr.service';

@Component({
  selector: 'app-design-question',
  templateUrl: './design-question.component.html'
})
export class DesignQuestionComponent {
  title: string | undefined;
  answerTime: number | undefined;
  previewTime: number | undefined;

  constructor(private restService: RestService, private router: Router, private route: ActivatedRoute, private signalRService: SignalRService) {
  }

  addQuestion() {
    this.router.navigate(['/designQuestion']);
  }
}
