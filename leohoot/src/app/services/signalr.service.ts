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
      .withAutomaticReconnect([0, 2000, 10000, 30000])  // Specify retry intervals
      .build();

    // Set keep-alive interval in buildConnection method
      this.connection.serverTimeoutInMilliseconds = 60000;  // Default is 30,000 ms (30 seconds)
      this.connection.keepAliveIntervalInMilliseconds = 15000;  // Set ping interval

      this.connection.onreconnecting(error => {
        console.log('Connection lost, trying to reconnect...', error);
      });
      
      this.connection.onreconnected(connectionId => {
        console.log('Connection reestablished:', connectionId);
        // Optionally trigger any sync needed after reconnection
      });
      
  
    // Handle connection lifecycle
    this.connection.onclose((error) => {
      console.log('Connection closed:', error);
      this.connectionClosedSubject.next();
    });

    this.connection.on("gameEnded", (gameId: number) => {
      this.gameEnded$.next(gameId);
    });
  
    // Start connection with retry logic
    this.startConnection();
  }

  
  private startConnection() {
    this.connection.start()
      .then(() => {
        console.log("Connection started");
      })
      .catch(err => {
        console.log('Error while establishing connection, retrying...', err);
        setTimeout(() => this.startConnection(), 5000);  // Retry if connection fails initially
      });
  }
}
