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

        Question question2 = new Question()
        {
            QuestionText = "Is Syp cool?",
            QuestionNumber = 2,
            PreviewTime = 0,
            AnswerTimeInSeconds = 10,
            Answers =
            [
                new Answer()
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
        };

        Question question1 = new()
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
        };

        Quiz quiz = new()
        {
            Title = "Demo Quiz",
            Description = "This is a demo quiz",
            Creator = user,
            Questions =
            [
                question1,
                question2
            ]
        };
        ctx.Quizzes.Add(quiz);

        await ctx.SaveChangesAsync();
    }
}