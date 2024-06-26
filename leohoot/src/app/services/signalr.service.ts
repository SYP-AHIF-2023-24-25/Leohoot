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
      .withUrl(`${environment.apiUrl}/hub`, {skipNegotiation: true, transport: signalR.HttpTransportType.WebSockets})
      .build();

    this.connection.onclose((error) => {
      this.connectionClosedSubject.next();
    });

    this.connection.on("gameEnded", (gameId: number) => {
      this.gameEnded$.next(gameId);
    });
  
    this.connection.start()
      .then(() => {
        console.log("Connection started");
      })
      .catch(err => console.log('Error while establishing connection :('));
  }

}
