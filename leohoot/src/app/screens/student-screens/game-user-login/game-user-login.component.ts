import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RestService } from '../../../services/rest.service';
import { SignalRService } from '../../../services/signalr.service';
import { AlertService } from 'src/app/services/alert.service';

@Component({
  selector: 'app-game-user-login',
  templateUrl: './game-user-login.component.html',
})
export class GameUserLoginComponent {
  username: string | undefined;
  gameId!: number;
  constructor(private router: Router, private signalRService: SignalRService, private route: ActivatedRoute, private alertService: AlertService){

  }
  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (typeof params['gameId'] !== 'undefined') {
        this.gameId = parseInt(params['gameId']);
      }
      this.signalRService.connection.on("registeredUserFailed", (name) => {
        this.alertService.show('error', 'Username already exists.');
      });

      this.signalRService.connection.on("registeredUserSuccess", async (gameId, name) => {
        sessionStorage.setItem("username", name);
        await this.router.navigate(['/waitingPage'], { queryParams: { gameId: gameId } });
      });
    });
  }

  async addUser(){
    await this.signalRService.connection.send("registerUser", this.gameId, this.username);
  }
}
