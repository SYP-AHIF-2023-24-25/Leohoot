import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RestService } from '../../../services/rest.service';
import { SignalRService } from '../../../services/signalr.service';
import { QuestionStudent } from '../../../model/question-student';

@Component({
  selector: 'app-loading-screen',
  templateUrl: './loading-screen.component.html',
  styleUrls: []
})
export class LoadingScreenComponent {
  gameId!: number;
  question!: QuestionStudent;
  username: string = sessionStorage.getItem("username") || "test";

  constructor(private router: Router, private route: ActivatedRoute, private restservice: RestService, private signalRService: SignalRService) {
    this.getParams();
    this.signalRService.connection.on("endLoading", (gameId: number) => {
      if (gameId == this.gameId) {
        this.router.navigate(['/interimResult'], { queryParams: { gameId: this.gameId } });
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
