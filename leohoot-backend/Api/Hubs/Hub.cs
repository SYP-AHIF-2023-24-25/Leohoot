using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace Api.Hubs;

public class LeohootHub : Hub
{
    public LeohootHub() {
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

    public async Task QuestionFinished(int gameId)
    {
        var game = Repository.GetInstance().GetGameById(gameId);
        game!.UpdatePoints();
        await Clients.All.SendAsync("questionFinished", gameId);
    }

    public async Task SendToNextQuestion(int gameId) => await Clients.All.SendAsync("nextQuestion", gameId);

    public async Task FinishPreview(int gameId) => await Clients.All.SendAsync("previewFinished", gameId);

    public async Task FinishGame(int gameId) => await Clients.All.SendAsync("gameFinished", gameId);

    public async Task DeleteUser(int gameId, string username)
    {
        var game = Repository.GetInstance().GetGameById(gameId);
        game!.DeleteUser(username);
        await Clients.All.SendAsync("deletedUser", gameId, username);
    }

    public async Task CancelGame(int gameId)
    {
        await Clients.All.SendAsync("gameEnded", gameId);
    }
}