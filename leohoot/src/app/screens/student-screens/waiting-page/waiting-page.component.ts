import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SignalRService } from '../../../services/signalr.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-student-waiting-page',
  templateUrl: './waiting-page.component.html',
})
export class WaitingPageComponent {
  gameId!: number;
  points: number = 0;
  username: string = sessionStorage.getItem("username") || "test";
  gameEndedSubscription: Subscription;

  constructor(private router: Router, private route: ActivatedRoute, private signalRService: SignalRService) {
    this.route.queryParams.subscribe(params => {
      if (typeof params['gameId'] !== 'undefined') {
        this.gameId = parseInt(params['gameId']);
        this.signalRService.connection.on("nextQuestion", (gameId: number) => {
          if (gameId == this.gameId) {
            this.router.navigate(['/answerView'], { queryParams: { gameId: this.gameId }});
          }
        });
      }
    });

    this.gameEndedSubscription = this.signalRService.gameEnded$.subscribe((gameId: number) => {
      if (gameId === this.gameId) {
        alert("Game was canceled by the teacher");
        this.router.navigate(['/gameLogin']);
      }
    });
  }

    
  ngOnDestroy() {
    this.gameEndedSubscription.unsubscribe();
  }
}
