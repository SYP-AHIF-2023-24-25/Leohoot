import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RestService } from '../../../services/rest.service';
import { SignalRService } from '../../../services/signalr.service';
import { QuestionStudent } from '../../../model/question-student';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-loading-screen',
  templateUrl: './loading-screen.component.html',
  styleUrls: []
})
export class LoadingScreenComponent {
  gameId!: number;
  question!: QuestionStudent;
  username: string = sessionStorage.getItem("username") || "test";
  gameEndedSubscription: Subscription;

  constructor(private router: Router, private route: ActivatedRoute, private restservice: RestService, private signalRService: SignalRService) {
    this.getParams();
    this.signalRService.connection.on("endLoading", (gameId: number) => {
      if (gameId == this.gameId) {
        this.router.navigate(['/interimResult'], { queryParams: { gameId: this.gameId } });
      }
    });

    this.gameEndedSubscription = this.signalRService.gameEnded$.subscribe((gameId: number) => {
      if (gameId === this.gameId) {
        alert("Game was canceled by the teacher");
        this.router.navigate(['/gameLogin']);
      }
    });
  }

  
  ngOnDestroy() {
    this.gameEndedSubscription.unsubscribe();
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
