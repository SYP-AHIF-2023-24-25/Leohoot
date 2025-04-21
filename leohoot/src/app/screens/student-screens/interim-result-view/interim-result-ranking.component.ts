import {Component, Input} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {RestService} from "../../../services/rest.service";
import { SignalRService } from '../../../services/signalr.service';
import { QuestionTeacher } from 'src/app/model/question-teacher';
import { QuestionStudent } from 'src/app/model/question-student';
import { Subscription } from 'rxjs';
import { AlertService } from 'src/app/services/alert.service';

@Component({
  selector: 'app-students-mobile-ranking',
  templateUrl: './interim-result-ranking.component.html',
  styleUrls: []
})
export class InterimResultRankingComponent {
  gameId!: number;
  username: string = sessionStorage.getItem("username") || "test";
  question!: QuestionStudent;
  gameEndedRegistered = false;
  gameEndedSubscription: Subscription;
  rightAnswer: boolean = false;
  
  loadingTexts = [
    "Know the answer?",
    "Ready for the next one?",
    "Think fast!",
    "Loading next challenge...",
    "Sharpening the question...",
    "Next riddle loading...",
    "Preparing the next question...",
  ];

  constructor(private router: Router, private route: ActivatedRoute, private restservice: RestService, private signalRService: SignalRService, private alertService: AlertService) {
    this.gameEndedSubscription = this.signalRService.gameEnded$.subscribe((gameId: number) => {
      if (gameId === this.gameId) {
        this.alertService.show('info', "Game was canceled by the teacher.");
        this.router.navigate(['/gameLogin']);
      }
    });
  }

  ngOnInit() {
    this.getParams();

    this.signalRService.connection.on("nextQuestion", async (gameId: number) => {
      console.log("nextQuestion");
      if (gameId === this.gameId)
      {
        const randomText = this.loadingTexts[Math.floor(Math.random() * this.loadingTexts.length)];

        const queryParams = {
          gameId: this.gameId,
          loadingText: randomText
        };
        this.router.navigate(['/loadingScreen'], { queryParams });
      }
    });

    this.signalRService.connection.on("gameFinished", async (gameId: number) => {
      if (gameId === this.gameId)
      {
        this.router.navigate(['/resultView'], { queryParams: { gameId: this.gameId } });
      }
    });

    this.restservice.getQuestionStudent(this.gameId, this.username).subscribe((data) => {
      this.question = data;
      this.rightAnswer = this.question.currentPoints > 0;
   });

  }

  ngOnDestroy() {
    this.gameEndedSubscription.unsubscribe();
  }

  getParams() {
    this.route.queryParams.subscribe(params => {
      if (typeof params['gameId'] !== 'undefined') {
        this.gameId = parseInt(params['gameId']);
      }
    });
  }
}
