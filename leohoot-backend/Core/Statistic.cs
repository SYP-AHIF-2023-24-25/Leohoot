using System;

namespace Core;

public class Statistic
{
    public int Id { get; set; }

    public Dictionary<int, List<bool>> QuestionAnswers { get; set; } = [];   
}