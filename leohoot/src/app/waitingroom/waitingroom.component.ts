import { Component } from '@angular/core';
import { RestService } from '../services/rest.service';
import { Quiz } from 'src/model/quiz';

@Component({
  selector: 'app-waitingroom',
  templateUrl: './waitingroom.component.html',
  styleUrls: ['./waitingroom.component.css']
})
export class WaitingroomComponent {
  qrCodeData: string;
  gamePin: number;
  quiz!: Quiz;

  constructor(restService: RestService) {
    this.quiz = restService.getQuiz();
    this.qrCodeData = this.quiz.title + Date.now().toString() + this.quiz.creator;
    this.gamePin = 12345678;
  }

  //TODO:
  // AUDIO
  // QR CODE
  // WEBSOCKETS
  // unique code - speichern im backend? schauen ob er schon existiert!!
  // start button
}
