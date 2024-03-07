using Microsoft.EntityFrameworkCore;
using LeohootBackend.Model;
using System.Formats.Asn1;

namespace LeohootBackend;

public sealed class DataContext(IConfiguration configuration) : DbContext
{
    public required DbSet<Quiz> Quizzes { get; init; }
    public required DbSet<Question> Questions { get; init; }
    public required DbSet<Answer> Answers { get; init; }
    public required DbSet<User> Users { get; init; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
    }
    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        base.OnConfiguring(optionsBuilder);
        optionsBuilder.EnableSensitiveDataLogging();
        optionsBuilder.UseSqlite(configuration.GetConnectionString("DefaultConnection"));
    }

    public async Task<object> GetAllQuizzes()
    {
        return await Quizzes
            .Select(q => new
            {
                Id = q.Id,
                Title = q.Title,
                Description = q.Description,
                CreatorName = q.Creator!.Username,
                QuestionCount = q.Questions.Count,
                Questions = q.Questions.Select(question => new
                {
                    Id = question.Id,
                    Text = question.QuestionText,
                    Number = question.QuestionNumber,
                    Answers = question.Answers.Select(answer => new
                    {
                        Id = answer.Id,
                        AnswerText = answer.AnswerText,
                        IsCorrect = answer.IsCorrect
                    }).ToList()
                }).ToList(),
                ImageName = q.ImageName
            })
            .ToListAsync();
    }

    public record AnswerDto(string AnswerText, bool IsCorrect);
    public record QuestionDto(string QuestionText, int QuestionNumber, string ImageName, int AnswerTimeInSeconds, int PreviewTime, List<AnswerDto> Answers);
    public record QuizDto(int Id, string Title, string Description, string CreatorName, List<QuestionDto> Questions, string ImageName);

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
                        question.QuestionText,
                        question.QuestionNumber,
                        question.ImageName ?? string.Empty,
                        question.AnswerTimeInSeconds,
                        question.PreviewTime,
                        question.Answers.Select(answer => new AnswerDto
                        (
                            answer.AnswerText,
                            answer.IsCorrect
                        )).ToList()
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
                question.QuestionText,
                question.QuestionNumber,
                question.ImageName ?? string.Empty,
                question.AnswerTimeInSeconds,
                question.PreviewTime,
                question.Answers.Select(answer => new AnswerDto
                (
                    answer.AnswerText,
                    answer.IsCorrect
                )).ToList()
            )).ToListAsync();
    }

    public async Task<QuestionDto?> GetQuestion(int quizId, int questionNumber)
    {
        QuizDto? quiz = await GetQuiz(quizId);
        if (quiz == null)
        {
            return null;
        }
        return quiz.Questions.Find(q => q.QuestionNumber == questionNumber);
    }

    public async Task<object?> GetQuestionStudent(int quizId, int questionNumber, string username)
    {
        return await Questions
            .Where(q => q.Id == questionNumber && q.QuizId == quizId)
            .Select(q => new
            {
                QuestionNumber = q.QuestionNumber,
                QuestionText = q.QuestionText,
                AnswerCount = q.Answers.Count,
                QuizLength = q.Quiz!.Questions.Count,
            }).FirstOrDefaultAsync();
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
        
        for (int i = 0; i < answers.Length; i++)
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

internal static class SampleData
{
    public static async Task InsertSampleData(this DataContext ctx)
    {
        User user = new()
        {
            Username = "sampleUser",
            Password = "samplePassword"
        };

        Quiz quiz = new()
        {
            ImageName = "/assets/images/herr-nilsson.jpg",
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
                    ImageName = "assets/images/panorama.jpg",
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
                    ImageName = "assets/images/hooti.png"
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
                    ImageName = "assets/images/herr-nilsson.jpg"
                }
            ]
        };
        ctx.Quizzes.Add(quiz);

        await ctx.SaveChangesAsync();
    }
}