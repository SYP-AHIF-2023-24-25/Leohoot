using System;

public class User
{
    public string Username { get; }
    public int Score { get; set; }

    public User(string username, int score)
    {
        Username = username;
        Score = score;
    }
}