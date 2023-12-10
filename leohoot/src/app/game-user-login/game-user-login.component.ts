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
  ngOnInit() {
    this.signalRService.connection.on("registeredUserFailed", (name) => {
      alert(`Username ${name} is already taken`);
    });

    this.signalRService.connection.on("registeredUserSuccess", (name) => {
      const queryParams = {
        username: name
      };
      this.router.navigate(['/studentWaitingPage'], { queryParams });
    });
  }

  addUser(){
    this.signalRService.connection.send("registerUser", this.username);
  }
}
