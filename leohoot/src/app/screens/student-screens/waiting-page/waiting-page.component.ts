import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SignalRService } from '../../../services/signalr.service';
import { Subscription } from 'rxjs';
import { AlertService } from 'src/app/services/alert.service';

@Component({
  selector: 'app-student-waiting-page',
  templateUrl: './waiting-page.component.html',
})
export class WaitingPageComponent {
  gameId!: number;
  points: number = 0;
  username: string = sessionStorage.getItem("username") || "test";
  gameEndedSubscription: Subscription;

  constructor(private router: Router, private route: ActivatedRoute, public signalRService: SignalRService, private alertService: AlertService) {
    this.route.queryParams.subscribe(params => {
      if (typeof params['gameId'] !== 'undefined') {
        this.gameId = parseInt(params['gameId']);
        this.signalRService.connection.on("startedGame", async (gameId: number) => {
          if (gameId == this.gameId) {
            await this.router.navigate(['/loadingScreen'], { queryParams: { gameId: this.gameId, loadingText: "Ready to start the game?" } });
          }
        });

        this.signalRService.connection.on("deletedUser", async (gameId: number, name: string) => {
          if (gameId == this.gameId && name == this.username) {
            this.alertService.show('info', "You were kicked from the game.");
            await this.router.navigate(['/gameLogin']);
          }
        });
      }
    });

    this.gameEndedSubscription = this.signalRService.gameEnded$.subscribe(async (gameId: number) => {
      if (gameId === this.gameId) {
        this.alertService.show('info', "Game was canceled by the teacher.");
        await this.router.navigate(['/gameLogin']);
      }
    });
  }


  ngOnDestroy() {
    this.gameEndedSubscription.unsubscribe();
    this.signalRService.connection.off("deletedUser");
    this.signalRService.connection.off("startedGame");

  }

  protected readonly parseInt = parseInt;
}
