import { Component } from '@angular/core';
import { RestService } from '../services/rest.service';
import { Quiz } from 'src/model/quiz';
import { Player } from 'src/model/player';
import * as signalR from '@microsoft/signalr';
import { ActivatedRoute, Router } from '@angular/router';
import { SignalRService } from '../services/signalr.service';

@Component({
  selector: 'app-waitingroom',
  templateUrl: './waitingroom.component.html',
})
export class WaitingroomComponent {
  qrCodeData: string;
  qrCodeTitle: string;
  gamePin: number;
  quiz!: Quiz;
  users: Player[] = [];

  constructor(restService: RestService, private router: Router, private route: ActivatedRoute, private signalRService: SignalRService) {
    this.quiz = restService.getQuiz();

    //TODO
    this.qrCodeData = "http://140.238.173.82:81/teacherDemoModeQuiz";    
    this.qrCodeTitle = this.quiz.title + Date.now().toString() + this.quiz.creator; 
    this.gamePin = this.titleTo8Digits(); 
  }

  ngOnInit() {
    this.signalRService.connection.on("registeredUser", (name) => {
      console.log("registeredUser")
      console.log(name);
      this.users.push({username: name, score: 0});
    });
  }

  titleTo8Digits(){
    let title = this.quiz.title + Date.now().toString() + this.quiz.creator;
    let numericValue = 0;
    for (let i = 0; i < title.length; i++) {
      numericValue = numericValue * 10 + title.charCodeAt(i);
    }
    numericValue = numericValue % 100000000;
  
    return numericValue;
  }

  startGame(){
    this.signalRService.connection.invoke("startGame", this.gamePin);
    this.router.navigate(['/game'], { queryParams: { gamePin: this.gamePin } });
  }
}
