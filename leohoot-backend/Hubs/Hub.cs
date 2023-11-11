using System.Net.Security;
using Microsoft.AspNetCore.SignalR;


namespace SignalRWebpack.Hubs;

public class ChatHub : Hub
{
    public override async Task OnConnectedAsync()
    {
        await SendMessage("Hello from the Hub!");
    }

    public async Task SendMessage(string message) => await Clients.All.SendAsync("messageReceived", message);
}