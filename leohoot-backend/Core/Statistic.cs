using System;
using Core.DataTransferObjects;
using Core.Entities;

namespace Core;

public class AnswerInformation
{
    public List<bool> AllAnswers { get; set; } = [];
    public List<int> CountPerAnswer { get; set; } = [];
}

public class Statistic
{
    public int Id { get; set; }

    public Dictionary<int, AnswerInformation> QuestionAnswers { get; set; } = [];
    public void AddAnswerToStatistic(int questionNumber, bool[] answers, bool isCorrect)
    {
        if (QuestionAnswers.ContainsKey(questionNumber))
        {
            QuestionAnswers[questionNumber].AllAnswers.Add(isCorrect);
            for (var i = 0; i < answers.Length; i++) 
            {
                if (answers[i])
                {
                    QuestionAnswers[questionNumber].CountPerAnswer[i]++;
                }
            }
        }
        else
        {
            QuestionAnswers.TryAdd(questionNumber, new AnswerInformation
            {
                AllAnswers = new List<bool> { isCorrect }
            });
            foreach (var a in answers)
            {
                if (a)
                {
                    QuestionAnswers[questionNumber].CountPerAnswer.Add(1);
                }
                else
                {
                    QuestionAnswers[questionNumber].CountPerAnswer.Add(0);
                }
            }
        }
    }
    
    
}