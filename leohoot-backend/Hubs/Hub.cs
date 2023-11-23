using System.ComponentModel;
using System.Net.Security;
using Microsoft.AspNetCore.SignalR;


namespace SignalRWebpack.Hubs;

public class ChatHub : Hub
{
    List<User> users = new List<User>();
    List<Answer> currentAnswers = new List<Answer>();

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

    public int GetPoints(double timeInMilliseconds) {
        int maxTimePoints = 1000;
        double timePercentage = 1 / maxTimePoints * timeInMilliseconds;
        double points = (1 - timePercentage)*maxTimePoints;
        return Convert.ToInt32(points);
    }

    public async Task SendRanking() => await Clients.Caller.SendAsync("rankingReceived", users.OrderByDescending(user => user.Score).Take(5).ToList());

    public async Task SendQuestionIsFinished() => await Clients.All.SendAsync("questionIsFinished");
    public async Task SendToNextQuestion() => await Clients.All.SendAsync("nextQuestion");
    public void AddAnswer(string username){
        User user = users.Find(user => user.Username == username)!;
        DateTime currentTime = DateTime.UtcNow;
        double milliseconds = currentTime.Subtract(new DateTime(1970, 1, 1, 0, 0, 0, DateTimeKind.Utc)).TotalMilliseconds;
        user.Score += GetPoints(milliseconds);
    }
    public async Task SendPoints(string username, int timeInMilliseconds) => await Clients.All.SendAsync("pointsReceived");
    
}