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

        // var user = modelBuilder.Entity<User>();
        // user.HasKey(p => p.Username);

        // var quiz = modelBuilder.Entity<Quiz>();
        // quiz.HasKey(q => q.QuizId);
        // quiz.HasOne(q => q.Creator)
        //     .WithMany()
        //     .HasForeignKey(q => q.UsernameCreator)
        //     .OnDelete(DeleteBehavior.Cascade);
        // quiz.HasMany(q => q.Questions)
        //     .WithOne()
        //     .HasForeignKey(q => q.QuestionId)
        //     .OnDelete(DeleteBehavior.Cascade);

        // var question = modelBuilder.Entity<Question>();
        // question.HasKey(q => q.QuestionId);
        // question
        //     .HasMany(q => q.Answers)
        //     .WithOne()
        //     .HasForeignKey(a => a.AnswerId)
        //     .OnDelete(DeleteBehavior.Cascade);

        // var answer = modelBuilder.Entity<Answer>();
        // answer.HasKey(a => a.AnswerId);
        // answer.Property(a => a.AnswerId).ValueGeneratedOnAdd();
    }
    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        base.OnConfiguring(optionsBuilder);
        optionsBuilder.EnableSensitiveDataLogging();
        optionsBuilder.UseSqlite(configuration.GetConnectionString("DefaultConnection"));
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