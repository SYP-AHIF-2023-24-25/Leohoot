using System.ComponentModel;
using System.Net.Security;
using Microsoft.AspNetCore.SignalR;
using LeohootBackend.Model;

namespace LeohootBackend.Hubs;

public class ChatHub : Hub
{
    static List<Player> users = new List<Player>{
       /* new User("Leo", 100),
        new User("Jason", 200),
        new User("Piper", 50),
        new User("Percy", 500),
        new User("Annabeth", 300),
        new User("Frank", 150),
        new User("Hazel", 250),
        new User("Nico", 400),
        new User("Reyna", 350),
        new User("Will", 450),
        new User("Rachel", 550),
        new User("Grover", 600),
        new User("Clarisse", 650),
        new User("Silena", 700),
        new User("Charles", 750),
        new User("Sophie", 800)*/
    };


    public ChatHub() {
    }

    static List<Player> currentAnswers = new List<Player>();

    public static int GetPoints(string username) => users.Find(user => user.Username == username)!.Score;

    public async Task RegisterUser(string username) {
        if (users.Find(user => user.Username == username) == null)
        {
            users.Add(new Player(username, 0));
            await Clients.All.SendAsync("registeredUser", username);
            await Clients.Caller.SendAsync("registeredUserSuccess", username);
        } else{
            await Clients.Caller.SendAsync("registeredUserFailed", username);
        }       
    }

    public async Task StartGame(int gamePin) => await Clients.All.SendAsync("startedGame", gamePin);

    public async Task SendRanking() => await Clients.Caller.SendAsync("rankingReceived", users.OrderByDescending(u => u.Score).Take(5).ToList());

    public async Task ConfirmAnswer(string username) {
        int score = 1000 - 1000/users.Count*currentAnswers.Count;
        currentAnswers.Add(new Player(username, score));
        
        await Clients.All.SendAsync("answerReceived", username);
    }

    public async Task SendEndLoading()
    {
        foreach (Player user in currentAnswers)
        {
            Player userToUpdate = users.Find(userToUpdate => userToUpdate.Username == user.Username)!;
            userToUpdate.Score += user.Score;
        }
        await Clients.All.SendAsync("endLoading");
    }

    public async Task SendPoints(string username)
    {
        int points = users.Find(user => user.Username == username)!.Score;
        Player? currentAnswer = currentAnswers.Find(user => user.Username == username);
        int currentPoints = 0;
        if (currentAnswer != null)
        {
            currentPoints = currentAnswer.Score;
        }
        await Clients.All.SendAsync("pointsReceived", points, currentPoints);
    }

    public async Task SendToNextQuestion(){
        currentAnswers.Clear();
        await Clients.All.SendAsync("nextQuestion");
    }
}