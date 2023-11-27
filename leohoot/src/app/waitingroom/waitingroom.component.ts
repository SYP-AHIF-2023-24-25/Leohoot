import { Component } from '@angular/core';
import { RestService } from '../services/rest.service';
import { Quiz } from 'src/model/quiz';
import { Player } from 'src/model/player';
import * as signalR from '@microsoft/signalr';

@Component({
  selector: 'app-waitingroom',
  templateUrl: './waitingroom.component.html',
  styleUrls: ['./waitingroom.component.css']
})
export class WaitingroomComponent {
  qrCodeData: string;
  qrCodeTitle: string;
  gamePin: number;
  quiz!: Quiz;
  connection!: signalR.HubConnection;
  users: Player[] = [];

  constructor(restService: RestService) {
    this.buildConnection();

    this.quiz = restService.getQuiz();

  //TODO: anhand von dem title die login page kreaiieren und dann hier verlinken (TRICKY)
    this.qrCodeData = "http://140.238.173.82:81/teacherDemoModeQuiz";  //TODO: Mias Page verlinken    
    this.qrCodeTitle = this.quiz.title + Date.now().toString() + this.quiz.creator;
    this.gamePin = this.titleTo8Digits(); 


    this.users.push({username: "Donna Sheridan", score: 0});
    this.users.push({username: "Sam Carmichael", score: 0});
    this.users.push({username: "Harry Bright", score: 0});
    this.users.push({username: "Bill Anderson", score: 0});
    this.users.push({username: "Sophie Sheridan", score: 0});
    this.users.push({username: "Sky", score: 0});
    this.users.push({username: "Ali", score: 0});
    this.users.push({username: "Lisa", score: 0});
    this.users.push({username: "Rosi", score: 0});
    this.users.push({username: "Tanya", score: 0});
    this.users.push({username: "Fernando", score: 0});
  }

  titleTo8Digits(){
    let numericValue = 0;
    for (let i = 0; i < this.qrCodeTitle.length; i++) {
      numericValue = numericValue * 10 + this.qrCodeTitle.charCodeAt(i);
    }
    numericValue = numericValue % 100000000;
  
    return numericValue;
  }

  buildConnection() {
    this.connection = new signalR.HubConnectionBuilder()
    .withUrl("http://localhost:5134/hub")
    .build();

    this.connection.start().catch(err => console.log('Error while establishing connection :('));
    
    this.connection.on("registerUser", (username) => {
        this.users.push({username: username, score: 0});
    });
  }  

  //TODO:
  // AUDIO
  // QR CODE
  // unique code - speichern im backend? schauen ob er schon existiert!!
  // start button
}
