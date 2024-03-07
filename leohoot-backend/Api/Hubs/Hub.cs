using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;

namespace Api.Hubs;

public class ChatHub : Hub
{
    public ChatHub() {
    }

    public async Task RegisterUser(int gameId, string username) {
        Console.WriteLine("Registering user " + username + " to game " + gameId);
        var game = Repository.GetInstance().GetGameById(gameId);
        if (game!.RegisterUser(username))
        {
            await Clients.All.SendAsync("registeredUser", gameId, username);
            await Clients.Caller.SendAsync("registeredUserSuccess", gameId, username);
        } else{
            await Clients.Caller.SendAsync("registeredUserFailed", gameId,username);
        }    
        await Clients.Caller.SendAsync("registeredSuccessfully", gameId, username);
    }

    public async Task StartGame(int gameId) => await Clients.All.SendAsync("startedGame", gameId);

    public async Task SendEndLoading(int gameId)
    {
        var game = Repository.GetInstance().GetGameById(gameId);
        game!.UpdatePoints();
        await Clients.All.SendAsync("endLoading", gameId);
    }

    public async Task SendToNextQuestion(int gameId){
        await Clients.All.SendAsync("nextQuestion", gameId);
    }
}