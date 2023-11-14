import { Component } from '@angular/core';
import * as signalR from "@microsoft/signalr";

@Component({
  selector: 'app-ranking',
  templateUrl: './ranking.component.html',
  styleUrls: ['./ranking.component.css']
})
export class RankingComponent {
  connection!: signalR.HubConnection;
  ngOnInit() {
    this.connection = new signalR.HubConnectionBuilder()
    .withUrl("http://localhost:5134/hub")
    .build();

    this.connection.start()
    .then(() => {
      console.log('Connection started!');
      this.connection.send("sendMessage", "Hello")
     } )
    .catch(err => console.log('Error while establishing connection :('));

    this.connection.on("messageReceived", (message) => {
      console.log(message);
    });
  }
}
