import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { RestService } from '../services/rest.service';
import { SignalRService } from '../services/signalr.service';

@Component({
  selector: 'app-game-user-login',
  templateUrl: './game-user-login.component.html',
})
export class GameUserLoginComponent {
  username: string | undefined;
  constructor(restService: RestService, private router: Router, private signalRService: SignalRService){
    
  }

  addUser(){
    this.signalRService.connection.send("registerUser", this.username);
    const queryParams = {
      username: this.username
    };

    //TODO: hier später richtige page verlinken
    this.router.navigate(['/studentWaitingPage'], { queryParams });
  }
}
