import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as signalR from '@microsoft/signalr';
import { RestService } from '../services/rest.service';
import { SignalRService } from '../services/signalr.service';

@Component({
  selector: 'app-students-loading-screen',
  templateUrl: './students-loading-screen.component.html',
  styleUrls: []
})
export class StudentsLoadingScreenComponent {
    currentQuestionId: number = 0;
  
    constructor(private router: Router, private route: ActivatedRoute, private restservice: RestService, private signalRService: SignalRService) { 
      this.getParams();
      this.signalRService.connection.on("endLoading", () => {
        const queryParams = {
          currentQuestionId: this.restservice.getNextQuestionId(this.currentQuestionId)
        };
        this.router.navigate(['/studentMobileRanking'], { queryParams });
      });
    }

    getParams() {
      this.route.queryParams.subscribe(params => {
        if (typeof params['currentQuestionId'] !== 'undefined') {
          this.currentQuestionId = parseInt(params['currentQuestionId']);
        }
      });
    }
}
