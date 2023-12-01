public class Answer {
    public string Username { get; }
    public DateTime Time { get; }

    public Answer(string username, DateTime time)
    {
        Username = username;
        Time = time;
    }
}