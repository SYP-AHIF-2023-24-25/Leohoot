import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class SignalRService {
  connection!: signalR.HubConnection;

  constructor() {
    this.buildConnection();
   }

  private buildConnection() {
    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(`${environment.apiUrl}/hub`, {skipNegotiation: true, transport: signalR.HttpTransportType.WebSockets})
      .build();

    this.connection.start()
      .then(() => {
        console.log("Connection started");
      })
      .catch(err => console.log('Error while establishing connection :('));
  }

}
