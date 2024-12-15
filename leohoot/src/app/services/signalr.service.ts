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
  }

  private buildConnection() {
    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(`${environment.apiUrl}/hub`, { skipNegotiation: true, transport: signalR.HttpTransportType.WebSockets })
      .withAutomaticReconnect()
      .build();
    this.connection.serverTimeoutInMilliseconds = 30000;
    this.connection.keepAliveIntervalInMilliseconds = 10000;

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
        console.log('Error while establishing connection, retrying...', err);
        setTimeout(() => this.startConnection(), 5000);
      });
  }
}
