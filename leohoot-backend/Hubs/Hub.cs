using Microsoft.AspNetCore.SignalR;

namespace LeohootBackend.Hubs;

public class ChatHub : Hub
{
    public ChatHub() {
    }

    public async Task RegisterUser(string username) {
        if (Repository.GetInstance().RegisterUser(username))
        {
            await Clients.All.SendAsync("registeredUser", username);
            await Clients.Caller.SendAsync("registeredUserSuccess", username);
        } else{
            await Clients.Caller.SendAsync("registeredUserFailed", username);
        }       
    }

    public async Task StartGame(int gamePin) => await Clients.All.SendAsync("startedGame", gamePin);

    public async Task SendRanking() => await Clients.Caller.SendAsync("rankingReceived", Repository.GetInstance().GetRanking());

    public async Task SendEndLoading()
    {
        Repository.GetInstance().UpdatePoints();
        await Clients.All.SendAsync("endLoading");
    }

    public async Task SendToNextQuestion(){
        Repository.GetInstance().ClearCurrentAnswers();
        await Clients.All.SendAsync("nextQuestion");
    }
}