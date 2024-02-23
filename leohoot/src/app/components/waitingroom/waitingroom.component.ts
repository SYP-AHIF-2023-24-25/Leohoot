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
  gamePin: number = 0;
  quizId: number = 1;
  users: Player[] = [];

  constructor(private restService: RestService, private router: Router, private route: ActivatedRoute, private signalRService: SignalRService) {
    restService.getNewGameId(1).subscribe((response) => 
    {
      this.qrCodeData = "http://140.238.173.82:8000/gameUserLogin";    
      this.qrCodeTitle = "Scan the QR code to join the game!"; 
      this.gamePin = response;
    });
  }

  ngOnInit() {
    this.signalRService.connection.on("registeredUser", (gamePin, name) => {
      if (gamePin == this.gamePin)
      {
        this.users.push({username: name, score: 0});
      }
    });
  }

  startGame(){
    this.signalRService.connection.invoke("startGame", this.gamePin);
    this.router.navigate(['/question'], { queryParams: { gameId: this.gamePin , mode: 1} });
  }
}
