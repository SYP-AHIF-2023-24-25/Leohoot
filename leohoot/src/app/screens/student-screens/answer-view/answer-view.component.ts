import {Component} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {RestService} from "../../../services/rest.service";
import { SignalRService } from '../../../services/signalr.service';
import { QuestionStudent } from 'src/app/model/question-student';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-answer-view',
  templateUrl: './answer-view.component.html',
  styleUrls: []
})
export class AnswerViewComponent {
  gameId!: number;
  question!: QuestionStudent;
  username: string = sessionStorage.getItem("username") || "test";
  questionIsFinished: boolean = false;
  buttons!: boolean[];
  colors = [
    'bg-button-yellow',
    'bg-green-400',
    'bg-rose-400',
    'bg-blue-400',
  ];

  isSubmitting: boolean = false;

  icons = [
    'assets/images/cat.png',
    'assets/images/frog.png',
    'assets/images/crab.png',
    'assets/images/bird.png'
  ]
  gameEndedSubscription: Subscription;

  loadingTexts = [
    "Already finished?",
    "Crunching numbers...",
    "Checking answers...",
    "Summoning results...",
    "Almost there...",
    "Evaluating your brilliance...",
    "Loading magic...",
    "Calculating your genius...",
    "Preparing the results...",
  ];

  constructor(private router: Router, private route: ActivatedRoute, private restservice: RestService, private signalRService: SignalRService) {
    this.gameEndedSubscription = this.signalRService.gameEnded$.subscribe(async (gameId: number) => {
      if (gameId === this.gameId) {
        alert("Game was canceled by the teacher");
        await this.router.navigate(['/gameLogin']);
      }
    });
  }

  ngOnInit() {
    this.getParams();
  }

  ngOnDestroy() {
    this.gameEndedSubscription.unsubscribe();
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

  isAnyButtonTrue(): boolean {
    console.log(this.buttons.some(button => button))
    return this.buttons.some(button => button);
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
    if (this.isSubmitting) return;

    this.isSubmitting = true;

    const randomText = this.loadingTexts[Math.floor(Math.random() * this.loadingTexts.length)];

    this.restservice.addAnswer(this.gameId, this.buttons, this.username).subscribe(async (response) => {
      await this.router.navigate(['/loadingScreen'], { queryParams: { gameId: this.gameId, loadingText: randomText } });
    });
  }

  isModalVisible: boolean = false;

  showQuestion() {
    this.isModalVisible = true;
  }

  closeModal() {
    this.isModalVisible = false;
  }
}
