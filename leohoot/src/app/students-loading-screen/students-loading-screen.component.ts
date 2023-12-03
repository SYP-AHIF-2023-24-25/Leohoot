import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as signalR from '@microsoft/signalr';
import { RestService } from '../services/rest.service';

@Component({
  selector: 'app-students-loading-screen',
  templateUrl: './students-loading-screen.component.html',
  styleUrls: ['./students-loading-screen.component.css']
})
export class StudentsLoadingScreenComponent {
    connection!: signalR.HubConnection;
    currentQuestionId: number = 0;
  
    constructor(private router: Router, private route: ActivatedRoute, private restservice: RestService) { 
      this.getParams();
      this.buildConnection();
    }
  
    ngOnInit(): void {
    }

    buildConnection() {
      this.connection = new signalR.HubConnectionBuilder()
      .withUrl("http://localhost:5134/hub")
      .build();
  
      this.connection.start()
      .then(() => {
        this.connection.on("endLoading", () => {
          const queryParams = {
            currentQuestionId: this.restservice.getNextQuestionId(this.currentQuestionId)
          };
          this.router.navigate(['/studentMobileRanking'], { queryParams });
        });
      })
      .catch(err => console.log('Error while establishing connection :('));
    }

    getParams() {
      this.route.queryParams.subscribe(params => {
        if (typeof params['currentQuestionId'] !== 'undefined') {
          console.log(params['currentQuestionId']);
          this.currentQuestionId = parseInt(params['currentQuestionId']);
        }
        this.buildConnection();
      });
    }
}
