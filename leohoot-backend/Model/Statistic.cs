using System;

namespace LeohootBackend.Model;

public class Statistic
{
    public int Id { get; set; }

    public Dictionary<int, List<bool>> QuestionAnswers { get; set; } = new Dictionary<int, List<bool>>();   
}