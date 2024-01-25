import { Component } from '@angular/core';
import { RestService } from '../../services/rest.service';
import { Quiz } from '../../model/quiz';
import { Player } from '../../model/player';
import { ActivatedRoute, Router } from '@angular/router';
import { SignalRService } from '../../services/signalr.service';

@Component({
  selector: 'app-waitingroom',
  templateUrl: './waitingroom.component.html',
})
export class WaitingroomComponent {
  qrCodeData!: string;
  qrCodeTitle!: string;
  gamePin!: number;
  quiz!: Quiz;
  users: Player[] = [];

  constructor(private restService: RestService, private router: Router, private route: ActivatedRoute, private signalRService: SignalRService) {
    restService.getQuizById(1).subscribe((data) => {;
      this.quiz = data;
      
      //TODO
      this.qrCodeData = "http://140.238.173.82:8000/gameUserLogin";    
      this.qrCodeTitle = this.quiz.title + Date.now().toString() + this.quiz.creator; 
      
      do{
        this.gamePin = this.generateGamePin();
      } while (this.gamePin < 10000000 || this.gamePin > 99999999);

      //restService.addGamePin(this.gamePin);
    });
  }

  ngOnInit() {
    this.signalRService.connection.on("registeredUser", (name) => {
      console.log("registeredUser")
      console.log(name);
      this.users.push({username: name, score: 0});
    });
  }

  hashString(str: string): number {
    let hash = 0;

    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = (hash << 5) - hash + char;
    }

    return hash;
  }

  generateGamePin(): number {
    const currentDateWithTime = new Date();
    const uniqueString = this.qrCodeTitle + currentDateWithTime.toISOString() + this.quiz.creator;
      const hashedValue = this.hashString(uniqueString);
      
      const gamePin = (hashedValue % 90000000) + 10000000;

      return gamePin;
  }


  startGame(){
    this.signalRService.connection.invoke("startGame", this.gamePin);
    this.router.navigate(['/question'], { queryParams: { currentQuestionId: 1 , mode: 1} });
  }
}
