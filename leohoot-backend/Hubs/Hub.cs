using System.Net.Security;
using Microsoft.AspNetCore.SignalR;


namespace SignalRWebpack.Hubs;

public class ChatHub : Hub
{
    List<User> users = new List<User>();

    public ChatHub() {
        users.Add(new User("Leo", 100));
        users.Add(new User("Jason", 200));
        users.Add(new User("Piper", 50));
        users.Add(new User("Percy", 500));
        users.Add(new User("Annabeth", 300));
        users.Add(new User("Frank", 150));
        users.Add(new User("Hazel", 250));
        users.Add(new User("Nico", 400));
        users.Add(new User("Reyna", 350));
        users.Add(new User("Will", 450));
        users.Add(new User("Rachel", 550));
        users.Add(new User("Grover", 600));
        users.Add(new User("Clarisse", 650));
        users.Add(new User("Silena", 700));
        users.Add(new User("Charles", 750));

    }

    public async Task SendRanking() => await Clients.Caller.SendAsync("rankingReceived", users.OrderByDescending(user => user.Score).Take(5).ToList());

    public async Task SendQuestionIsFinished() => await Clients.All.SendAsync("questionIsFinished");
}