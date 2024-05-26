using Base.Core.Contracts;
using Base.Persistence;
using Core.Contracts;
using Core.DataTransferObjects;
using Core.Entities;
using Microsoft.EntityFrameworkCore;

namespace Persistence;

public class QuizRepository: GenericRepository<Quiz>, IQuizRepository
{
    private readonly DbSet<Quiz> _quizzes;

    public QuizRepository(DbSet<Quiz> quizzes): base(quizzes)
    {
        _quizzes = quizzes;
    }
    
    public async Task<List<QuizDto>> GetAllQuizzes()
    {
        return await _quizzes
            .Select(q => new QuizDto
            (
                q.Id,
                q.Title,
                q.Description,
                q.CreatorName,
                q.Questions
                    .Select(question => new QuestionDto
                    (
                        question.QuestionNumber,
                        question.QuestionText,
                        question.AnswerTimeInSeconds,
                        question.Answers.Select(answer => new AnswerDto
                        (
                            answer.AnswerText,
                            answer.IsCorrect
                        )).ToList(),
                        question.ImageName ?? string.Empty,
                        question.PreviewTime,
                        question.Snapshot ?? string.Empty,
                        question.ShowMultipleChoice ?? false
                    )).ToList(),
                q.ImageName
            ))
            .ToListAsync();
    }
    public async Task<QuizDto?> GetQuizDto(int quizId)
    {
        QuizDto? quiz = await _quizzes
            .Where(q => q.Id == quizId)
            .Select(q => new QuizDto
            (
                q.Id,
                q.Title,
                q.Description,
                q.CreatorName,
                q.Questions
                    .Select(question => new QuestionDto
                    (
                        question.QuestionNumber,
                        question.QuestionText,
                        question.AnswerTimeInSeconds,
                        question.Answers.Select(answer => new AnswerDto
                        (
                            answer.AnswerText,
                            answer.IsCorrect
                        )).ToList(),
                        question.ImageName,
                        question.PreviewTime,
                        question.Snapshot,
                        question.ShowMultipleChoice ?? false
                    )).ToList(),
                q.ImageName
            ))
            .SingleOrDefaultAsync();
        
        return quiz;
    }

    public async Task<Quiz?> GetQuiz(int quizId)
    {
        var quiz = await _quizzes.SingleOrDefaultAsync(quiz => quiz.Id == quizId);
        return quiz;
    }

    public async Task<List<QuestionDto>> GetQuestions(int quizId)
    {
        return await _quizzes
            .Where(quiz => quiz.Id == quizId)
            .SelectMany(quiz => quiz.Questions)
            .Select(question => new QuestionDto
            (
                question.QuestionNumber,
                question.QuestionText,
                question.AnswerTimeInSeconds,
                question.Answers.Select(answer => new AnswerDto
                (
                    answer.AnswerText,
                    answer.IsCorrect
                )).ToList(),
                question.ImageName,
                question.PreviewTime,
                question.Snapshot,
                question.ShowMultipleChoice ?? false
            )).ToListAsync();
    }

    public async Task<QuestionDto?> GetQuestion(int quizId, int questionNumber)
    {
        var quiz = await GetQuizDto(quizId);
        return quiz?.Questions.Find(q => q.QuestionNumber == questionNumber);
    }

    public async Task<bool> IsAnswerCorrect(int quizId, int questionNumber, bool[] answers)
    {
        var question =  await _quizzes
            .Where(quiz => quiz.Id == quizId)
            .SelectMany(quiz => quiz.Questions)
            .Where(q => q.QuestionNumber == questionNumber && q.QuizId == quizId)
            .Select(q => new
            {
                Answers = q.Answers.Select(answer => new
                {
                    answer.IsCorrect
                }).ToList()
            }).FirstOrDefaultAsync();
        
        for (var i = 0; i < answers.Length; i++)
        {
            var answer = answers[i];
            var correctAnswer = question!.Answers[i];
            if (answer != correctAnswer.IsCorrect)
            {
                return false;
            }
        }

        return true;
    }
}