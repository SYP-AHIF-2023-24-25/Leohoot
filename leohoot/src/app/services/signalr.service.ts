import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';

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
      //.withUrl("ws://140.238.173.82:8001/hub", {skipNegotiation: true, transport: signalR.HttpTransportType.WebSockets})
      .withUrl("http://localhost:5000/hub", {skipNegotiation: true, transport: signalR.HttpTransportType.WebSockets})
      .build();

    this.connection.start()
      .then(() => {
        console.log("Connection started");
      })
      .catch(err => console.log('Error while establishing connection :('));
  }

}
