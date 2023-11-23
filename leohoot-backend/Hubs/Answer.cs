public class Answer {
    public string Username { get; }
    public DateTime Time { get; }

    public Answer(string username, DateTime time)
    {
        Username = username;
        Time = time;
    }

    public int GetPoints(int timeInMilliseconds) {
        int maxTimePoints = 1000;
        double timePercentage = (double)1 / maxTimePoints * timeInMilliseconds;
        double points = (1 - timePercentage)*maxTimePoints;
        return Convert.ToInt32(points);
    }
}