import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RestService } from '../../services/rest.service';
import { SignalRService } from '../../services/signalr.service';
import { StudentViewData } from '../../model/student-view-data';

@Component({
  selector: 'app-students-loading-screen',
  templateUrl: './students-loading-screen.component.html',
  styleUrls: []
})
export class StudentsLoadingScreenComponent {
  gameId!: number;
  question!: StudentViewData;
  username: string = sessionStorage.getItem("username") || "test";

  constructor(private router: Router, private route: ActivatedRoute, private restservice: RestService, private signalRService: SignalRService) {
    this.getParams();
    this.signalRService.connection.on("endLoading", (gameId: number) => {
      if (gameId == this.gameId) {
        this.router.navigate(['/studentMobileRanking'], { queryParams: { gameId: this.gameId } });
      }
    });
  }

  getParams() {
    this.route.queryParams.subscribe(params => {
      if (typeof params['gameId'] !== 'undefined') {
        this.gameId = parseInt(params['gameId']);
        this.restservice.getQuestionStudent(this.gameId, this.username).subscribe((data) => {
          this.question = data;
        });
      }
    });
  }
}
