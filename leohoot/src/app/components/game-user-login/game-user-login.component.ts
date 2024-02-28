import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RestService } from '../../services/rest.service';
import { SignalRService } from '../../services/signalr.service';

@Component({
  selector: 'app-game-user-login',
  templateUrl: './game-user-login.component.html',
})
export class GameUserLoginComponent {
  username: string | undefined;
  gameId!: number;
  constructor(private router: Router, private signalRService: SignalRService, private route: ActivatedRoute){
    
  }
  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (typeof params['gameId'] !== 'undefined') {
        this.gameId = parseInt(params['gameId']);
      }
      this.signalRService.connection.on("registeredUserFailed", (name) => {
        alert(`Username ${name} is already taken`);
      });
  
      this.signalRService.connection.on("registeredUserSuccess", (gameId, name) => {
        sessionStorage.setItem("username", name);
        this.router.navigate(['/studentWaitingPage'], { queryParams: { gameId: gameId } });
      });
    });
  }

  addUser(){
    this.signalRService.connection.send("registerUser", this.gameId, this.username);
  }
}
