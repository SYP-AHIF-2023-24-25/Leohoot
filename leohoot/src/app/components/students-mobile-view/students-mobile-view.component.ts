import {Component} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {RestService} from "../../services/rest.service";
import { SignalRService } from '../../services/signalr.service';
import { StudentViewData } from 'src/app/model/student-view-data';

@Component({
  selector: 'app-students-mobile-view',
  templateUrl: './students-mobile-view.component.html',
  styleUrls: []
})
export class StudentsMobileViewComponent {
  gameId!: number;
  question!: StudentViewData;
  username: string = sessionStorage.getItem("username") || "test";
  questionIsFinished: boolean = false;
  buttons!: boolean[];
  colors = [
    'bg-button-yellow',
    'bg-green-400',
    'bg-rose-400',
    'bg-blue-400',
  ];

  icons = [
    'assets/images/cat.png',
    'assets/images/frog.png',
    'assets/images/crab.png',
    'assets/images/bird.png'
  ]
  points: number = 0;

  constructor(private router: Router, private route: ActivatedRoute, private restservice: RestService, private signalRService: SignalRService) {
  }

  ngOnInit() {
    this.getParams();
    this.signalRService.connection.on("endLoading", (gameId: number) => {
      if (gameId == this.gameId)
      {
        this.router.navigate(['/studentMobileRanking'], { queryParams: { gameId: this.gameId } });
      }
    });
  }

  getParams() {
    this.route.queryParams.subscribe(params => {
      if (typeof params['gameId'] !== 'undefined') {
        this.gameId = parseInt(params['gameId']);
      }
      this.restservice.getQuestionStudent(this.gameId, this.username).subscribe((data) => {
        this.question = data;
        this.generateButtons();
      });
    });
  }

  generateButtons() {
    this.buttons = [];
    for (let i = 0; i < this.question!.numberOfAnswers!; i++) {
      this.buttons.push(false);
    }
  }

  addToAnswer(indexOfAnswer: number) {
    this.buttons[indexOfAnswer] = !this.buttons[indexOfAnswer];
  }

  confirmAnswers() {
    this.restservice.addAnswer(this.gameId, this.buttons, this.username).subscribe((response) => {
      this.router.navigate(['/studentLoadingScreen'], { queryParams: { gameId: this.gameId } });
    });
  }
}
