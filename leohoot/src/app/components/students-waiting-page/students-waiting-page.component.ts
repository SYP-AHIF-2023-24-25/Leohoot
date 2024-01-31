import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RestService } from '../../services/rest.service';
import { SignalRService } from '../../services/signalr.service';

@Component({
  selector: 'app-student-waiting-page',
  templateUrl: './students-waiting-page.component.html',
})
export class StudentWaitingPageComponent {
  points: number = 0;
  username: string = sessionStorage.getItem("username") || "test";
  constructor(private router: Router, private route: ActivatedRoute, private restservice: RestService, private signalRService: SignalRService) {
    this.signalRService.connection.on("startedGame", () => {
      const queryParams = {
        currentQuestionId: 1
      };
      this.router.navigate(['/studentMobileView'], { queryParams });
    });
  }
}
