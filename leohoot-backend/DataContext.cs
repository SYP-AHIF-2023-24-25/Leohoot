using Microsoft.EntityFrameworkCore;
using LeohootBackend.Model;

namespace LeohootBackend;

public sealed class DataContext(IConfiguration configuration): DbContext
{
    public required DbSet<Quiz> Quizzes { get; init; }
    public required DbSet<Question> Questions { get; init; }
    public required DbSet<Answer> Answers { get; init; }
    public required DbSet<User> Users { get; init; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        var user = modelBuilder.Entity<User>();
        user.HasKey(p => p.Username);

        var quiz = modelBuilder.Entity<Quiz>();
        quiz.HasKey(q => q.QuizId);
        quiz.HasOne(q => q.Creator)
            .WithMany()
            .HasForeignKey(q => q.UsernameCreator)
            .OnDelete(DeleteBehavior.Cascade);
        quiz.HasMany(q => q.Questions)
            .WithOne()
            .HasForeignKey(q => q.QuestionId)
            .OnDelete(DeleteBehavior.Cascade);
        
        var question = modelBuilder.Entity<Question>();
        question.HasKey(q => q.QuestionId);
        question
            .HasMany(q => q.Answers)
            .WithOne()
            .HasForeignKey(a => a.AnswerId)
            .OnDelete(DeleteBehavior.Cascade);
        
        var answer = modelBuilder.Entity<Answer>()
            .HasKey(a => a.AnswerId);
    }
    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        base.OnConfiguring(optionsBuilder);
        optionsBuilder.UseSqlite(configuration.GetConnectionString("DefaultConnection"));
    }
}

internal static class SampleData
{
    public static async Task InsertSampleData(this DataContext ctx)
    {
        User user = new()
        {
            Username = "test",
            Password = "test"
        };
        await ctx.Users.AddAsync(user);

        await ctx.SaveChangesAsync();
    }
}