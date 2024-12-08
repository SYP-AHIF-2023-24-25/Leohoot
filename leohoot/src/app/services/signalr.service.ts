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
    this.monitorAppState(); // Monitor app state for better handling of background behavior
  }

  private buildConnection() {
    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(`${environment.apiUrl}/hub`, { skipNegotiation: true, transport: signalR.HttpTransportType.WebSockets })
      .withAutomaticReconnect([0, 2000, 10000, 30000]) // Retry intervals
      .build();

    // Adjust keep-alive settings for mobile devices
    this.connection.serverTimeoutInMilliseconds = 10000; // 10 seconds
    this.connection.keepAliveIntervalInMilliseconds = 5000; // 5 seconds

    this.connection.onreconnecting(error => {
      console.log('Connection lost, trying to reconnect...', error);
    });

    this.connection.onreconnected(connectionId => {
      console.log('Connection reestablished:', connectionId);
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
        setTimeout(() => this.startConnection(), 5000); // Retry if connection fails initially
      });
  }

  // Monitor app visibility and handle reconnection when the app is brought back to foreground
  private monitorAppState() {
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        console.log('App is in background or screen is off');
        // Optionally pause actions or notify server about background state
      } else {
        console.log('App is active');
        // Reconnect if the connection is closed
        if (this.connection.state === signalR.HubConnectionState.Disconnected) {
          console.log('Reconnecting SignalR connection...');
          this.startConnection();
        }
      }
    });
  }
}
