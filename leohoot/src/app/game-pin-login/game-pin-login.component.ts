import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RestService } from '../services/rest.service';
import { SignalRService } from '../services/signalr.service';

@Component({
  selector: 'app-game-login',
  templateUrl: './game-pin-login.component.html',
})
export class GameLoginComponent {
  gamePin!: number;

  constructor(private restservice: RestService, private router: Router, private signalRService: SignalRService){
    
  }

  enteredGamePin(){
    this.router.navigate(['/gameUserLogin'], { queryParams: { gamePin: this.gamePin } });
  }
}
