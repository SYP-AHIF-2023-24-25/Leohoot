using System;

public class Quiz
{
    public string Title { get; }
    public string Description { get; }
    public User Creator { get; }
    public List<Question> Questions { get; }

    public Quiz(string title, string description, User creator, List<Question> questions)
    {
        this.Title = title;
        this.Description = description;
        this.Creator = creator;
        this.Questions = questions;
    }
}