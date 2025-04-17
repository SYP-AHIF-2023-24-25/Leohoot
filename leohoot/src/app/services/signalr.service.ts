import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class SignalRService {
  connection!: signalR.HubConnection;
  connectionClosedSubject = new Subject<void>();
  connectionClosed$: Observable<void> = this.connectionClosedSubject.asObservable();
  gameEnded$ = new Subject<number>();

  constructor() {
    this.buildConnection();
    this.monitorAppState();
  }

  private buildConnection() {
    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(`${environment.apiUrl}/hub`, { skipNegotiation: true, transport: signalR.HttpTransportType.WebSockets })
      .configureLogging(signalR.LogLevel.Trace)
      .withAutomaticReconnect([0, 2000, 10000, 30000])
      .build();
      
    this.connection.on("gameEnded", (gameId: number) => {
      this.gameEnded$.next(gameId);
    });

    this.startConnection();
  }

  private startConnection() {
    this.connection.start()
      .then(() => {
        console.log("Connection started");
      })
      .catch(err => {
        setTimeout(() => this.startConnection(), 5000);
      });
  }

  private monitorAppState() {
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
      } else {
        if (this.connection.state === signalR.HubConnectionState.Disconnected) {
          this.startConnection();
        }
      }
    });
  }
}
