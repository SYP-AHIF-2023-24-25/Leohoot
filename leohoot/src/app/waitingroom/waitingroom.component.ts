import { Component } from '@angular/core';

@Component({
  selector: 'app-waitingroom',
  templateUrl: './waitingroom.component.html',
  styleUrls: ['./waitingroom.component.css']
})
export class WaitingroomComponent {
  qrCodeQuiz: string;

  constructor() {
    this.qrCodeQuiz = 'Quiz Name' + Date.now().toString();
  }
}
