using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Core;

namespace Persistence;

public sealed class ApplicationDbContext : DbContext
{
    public DbSet<Quiz> Quizzes { get; init; }
    public DbSet<Question> Questions { get; init; }
    public DbSet<Answer> Answers { get; init; }
    public DbSet<User> Users { get; init; }
    
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options): base(options)
    {
    }

    public ApplicationDbContext()
    {
    }
    
    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        const string connectionString = "Server=localhost; User ID=root; Password=password; Database=db";
        optionsBuilder.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString));
        base.OnConfiguring(optionsBuilder);
    }

    public async Task<List<QuizDto>> GetAllQuizzes()
    {
        return await Quizzes
            .Select(q => new QuizDto
            (
                q.Id,
                q.Title,
                q.Description,
                q.Creator!.Username,
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
                        question.showMultipleChoice ?? false
                    )).ToList(),
                q.ImageName
            ))
            .ToListAsync();
    }
    public async Task<QuizDto?> GetQuiz(int quizId)
    {
        QuizDto? quiz = await Quizzes
            .Where(q => q.Id == quizId)
            .Select(q => new QuizDto
            (
                q.Id,
                q.Title,
                q.Description,
                q.Creator!.Username,
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
                        question.showMultipleChoice ?? false
                    )).ToList(),
                q.ImageName
            ))
            .SingleOrDefaultAsync();
        
        return quiz;
    }

    public async Task<List<QuestionDto>> GetQuestions(int quizId)
    {
        return await Questions
            .Where(q => q.QuizId == quizId)
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
                question.showMultipleChoice ?? false
            )).ToListAsync();
    }

    public async Task<QuestionDto?> GetQuestion(int quizId, int questionNumber)
    {
        var quiz = await GetQuiz(quizId);
        return quiz?.Questions.Find(q => q.QuestionNumber == questionNumber);
    }

    public async Task<bool> IsAnswerCorrect(int quizId, int questionNumber, bool[] answers)
    {
        var question =  await Questions
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

public static class SampleData
{
    public static async Task InsertSampleData(this ApplicationDbContext ctx)
    {
        User user = new()
        {
            Username = "sampleUser",
            Password = "samplePassword"
        };

        Quiz quiz = new()
        {
            Title = "Demo Quiz",
            Description = "This is a demo quiz",
            Creator = user,
            Questions =
            [
                new()
                {
                    QuestionText = "What is the capital of France?",
                    QuestionNumber = 1,
                    PreviewTime = 19,
                    AnswerTimeInSeconds = 15,
                    Answers =
                    [
                        new()
                        {
                            AnswerText = "Lyon",
                            IsCorrect = false
                        },
                        new()
                        {
                            AnswerText = "Paris",
                            IsCorrect = true
                        },
                        new()
                        {
                            AnswerText = "Marseille",
                            IsCorrect = false
                        },
                        new()
                        {
                            AnswerText = "St. Tropez",
                            IsCorrect = false
                        }
                    ],
                    ImageName = "assets/images/panorama.jpg"
                },
                new()
                {
                    QuestionText = "Is Syp cool?",
                    QuestionNumber = 2,
                    PreviewTime = 5,
                    AnswerTimeInSeconds = 10,
                    Answers =
                    [
                        new()
                        {
                            AnswerText = "true",
                            IsCorrect = true
                        },
                        new()
                        {
                            AnswerText = "false",
                            IsCorrect = false
                        }
                    ]
                },
                new()
                {
                    QuestionText = "Which animals are in our mascot?",
                    QuestionNumber = 3,
                    PreviewTime = 5,
                    AnswerTimeInSeconds = 20,
                    Answers =
                    [
                        new()
                        {
                            AnswerText = "Lion",
                            IsCorrect = true
                        },
                        new()
                        {
                            AnswerText = "Chicken",
                            IsCorrect = false
                        },
                        new()
                        {
                            AnswerText = "Cat",
                            IsCorrect = false
                        },
                        new()
                        {
                            AnswerText = "Owl",
                            IsCorrect = true
                        }
                    ],
                    ImageName = "assets/images/hooti.png",
                    showMultipleChoice = true
                },
                new()
                {
                    QuestionText = "Du bist Busfahrer. An der 1. Haltestelle steigen 5 Gäste ein. An der 2. Haltestelle steigen 3 Leute zu und 2 aus. An der 3. Haltestelle steigen 4 ein und 5 aus. Wie alt ist der Busfahrer?",
                    QuestionNumber = 4,
                    PreviewTime = 5,
                    AnswerTimeInSeconds = 30,
                    Answers =
                    [
                        new()
                        {
                            AnswerText = "18, er ist Fahranfänger",
                            IsCorrect = false
                        },
                        new()
                        {
                            AnswerText = "Der Busfahrer existiert gar nicht",
                            IsCorrect = false
                        },
                        new()
                        {
                            AnswerText = "Du bist der Busfahrer",
                            IsCorrect = true
                        },
                        new()
                        {
                            AnswerText = "über 90, er hat den Führerschein in seinen jungen Jahren gemacht",
                            IsCorrect = false
                        }
                    ]
                },
                new()
                {
                    QuestionText = "Wie heißt Pippi Langstrumpfs Affe?",
                    QuestionNumber = 5,
                    PreviewTime = 5,
                    AnswerTimeInSeconds = 15,
                    Answers =
                    [
                        new()
                        {
                            AnswerText = "Herr Peterson",
                            IsCorrect = false
                        },
                        new()
                        {
                            AnswerText = "Nils Holgerson",
                            IsCorrect = false
                        },
                        new()
                        {
                            AnswerText = "Herr Nilsson",
                            IsCorrect = true
                        }
                    ],
                    ImageName = "assets/images/herr-nilsson.jpg",
                    showMultipleChoice = true
                }
            ]
        };
        ctx.Quizzes.Add(quiz);

        await ctx.SaveChangesAsync();
    }
}