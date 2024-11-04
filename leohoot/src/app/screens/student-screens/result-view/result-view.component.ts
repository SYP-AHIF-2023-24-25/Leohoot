import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { RestService } from 'src/app/services/rest.service';
import { SignalRService } from 'src/app/services/signalr.service';
import { PlayerResult } from 'src/app/model/player-result';

@Component({
  selector: 'app-result-view',
  templateUrl: './result-view.component.html'
})
export class ResultViewComponent {
  gameId!: number;
  gameEndedRegistered = false;
  gameEndedSubscription: Subscription;
  username: string = sessionStorage.getItem("username") || "test";
  playerResult!: PlayerResult;

  constructor(private router: Router, private route: ActivatedRoute, private restservice: RestService, private signalRService: SignalRService) {
    this.gameEndedSubscription = this.signalRService.gameEnded$.subscribe((gameId: number) => {
      if (gameId === this.gameId) {
        alert("Game was canceled by the teacher");
        this.router.navigate(['/gameLogin']);
      }
    });
  }

  ngOnInit() {
    this.getParams();

    this.restservice.getResults(this.gameId, this.username).subscribe((data) => {
      console.log(data);
      this.playerResult = data;
    });

  }

  ngOnDestroy() {
    this.gameEndedSubscription.unsubscribe();
  }

  getParams() {
    this.route.queryParams.subscribe(params => {
      if (typeof params['gameId'] !== 'undefined') {
        this.gameId = parseInt(params['gameId']);
      }
    });
  }

  getRankingSuffix(ranking: number): string {
    if (ranking % 100 >= 11 && ranking % 100 <= 13) {
      return 'th';
    }
    switch (ranking % 10) {
      case 1:
        return 'st';
      case 2:
        return 'nd';
      case 3:
        return 'rd';
      default:
        return 'th';
    }
  }
}
