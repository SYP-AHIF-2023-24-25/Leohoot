import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RestService } from '../../../services/rest.service';
import { SignalRService } from '../../../services/signalr.service';
import { QuestionStudent } from '../../../model/question-student';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-game-loading-screen',
  templateUrl: './game-loading-screen.component.html',
  styleUrls: []
})
export class GameLoadingScreen {
  gameId!: number;
  question!: QuestionStudent;
  username: string = sessionStorage.getItem("username") || "test";
  gameEndedSubscription: Subscription;
  loadingText: string | undefined;

  constructor(private router: Router, private route: ActivatedRoute, private restservice: RestService, private signalRService: SignalRService) {
    this.getParams();
    
    this.signalRService.connection.on("questionFinished", async (gameId: number) => {
      if (gameId == this.gameId) {
        await this.router.navigate(['/interimResult'], { queryParams: { gameId: this.gameId } });
      }
    });

    this.signalRService.connection.on("previewFinished", async (gameId: number) => {
      if(gameId == this.gameId) {
        await this.router.navigate(['/answerView'], { queryParams: { gameId: this.gameId } });
      }
    })

    this.gameEndedSubscription = this.signalRService.gameEnded$.subscribe(async (gameId: number) => {
      if (gameId === this.gameId) {
        alert("Game was canceled by the teacher");
        await this.router.navigate(['/gameLogin']);
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
      if (typeof params['loadingText'] !== 'undefined') {
        this.loadingText = params['loadingText'];
      }
    });
  }
}
