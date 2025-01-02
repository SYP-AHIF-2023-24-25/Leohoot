import { Component } from '@angular/core';
import { RestService } from '../../../services/rest.service';
import { Quiz } from '../../../model/quiz';
import { Player } from '../../../model/player';
import { ActivatedRoute, Router } from '@angular/router';
import { SignalRService } from '../../../services/signalr.service';

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
  isQrFullscreen = false;

  constructor(private restService: RestService, private router: Router, private route: ActivatedRoute, private signalRService: SignalRService) {
    this.route.queryParams.subscribe(params => {
      if (typeof params['quizId'] !== 'undefined') {
        this.quizId = parseInt(params['quizId']);
        this.restService.getNewGameId(this.quizId).subscribe((response) =>
        {
          this.qrCodeData = `https://leohoot.sophiehaider.com/gameUserLogin?gameId=${response}`;
          this.qrCodeTitle = "Scan the QR code to join the game!";
          this.gamePin = response;
        });
      }
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

  async startGame(){
    await this.signalRService.connection.invoke("startGame", this.gamePin);
    await this.router.navigate(['/questionPreview'], { queryParams: { gameId: this.gamePin , mode: 1} });
  }

  async onDeletePerson(user: Player) {
    this.users = this.users.filter(p => p !== user);
    await this.signalRService.connection.invoke("deleteUser", this.gamePin, user.username);
  }
  showQrFullscreen(): void {
    this.isQrFullscreen = true;
  }

  closeQrFullscreen(): void {
    this.isQrFullscreen = false;
  }
}
