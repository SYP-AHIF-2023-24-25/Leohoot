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
      .withUrl("http://localhost:5134/hub")
      .build();

    this.connection.start()
      .then(() => {
        console.log("Connection started");
      })
      .catch(err => console.log('Error while establishing connection :('));
  }

}
