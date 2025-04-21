import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RestService } from '../../../services/rest.service';
import { SignalRService } from '../../../services/signalr.service';
import { AlertService } from 'src/app/services/alert.service';

@Component({
  selector: 'app-game-login',
  templateUrl: './game-login.component.html',
})
export class GameLoginComponent {
  gameId!: string;

  constructor(private restservice: RestService, private router: Router, private alertService: AlertService){

  }

  enteredGamePin(){
    this.restservice.doesGameExist(this.gameId).subscribe(async (exists) => {
      if(exists){
        await this.router.navigate(['/gameUserLogin'], { queryParams: { gameId: this.gameId } });
      } else {
        this.alertService.show('error', 'Username already exists');
      }
    });
  }
}
