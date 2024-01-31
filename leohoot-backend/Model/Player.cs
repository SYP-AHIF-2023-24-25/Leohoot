using System;

namespace LeohootBackend.Model;

public class Player
{
    public string Username { get; }
    public int Score { get; set; }

    public Player(string username, int score)
    {
        Username = username;
        Score = score;
    }
}