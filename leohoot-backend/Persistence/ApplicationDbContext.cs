using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using System.Configuration;
using Core;
using Microsoft.Extensions.Configuration;

namespace Persistence;

using Core.Entities;
using Core.DataTransferObjects;

public sealed class ApplicationDbContext : DbContext
{
    public DbSet<Quiz> Quizzes { get; init; }
    public DbSet<Question> Questions { get; init; }
    public DbSet<Answer> Answers { get; init; }
    public DbSet<User> Users { get; init; }
    public DbSet<Image> Images { get; init;}

    public DbSet<Tag> Tags { get; init; }
    public DbSet<Statistic> Statistics { get; set; }
    public DbSet<StatisticQuestion> StatisticQuestions { get; set; }
    public DbSet<StatisticAnswers> StatisticAnswers { get; set; }

    public DbSet<FavoriteQuizzes> FavoriteQuizzes { get; set; }

    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options): base(options)
    {
    }

    public ApplicationDbContext()
    {
    }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        if (!optionsBuilder.IsConfigured)
        {
            string connectionString = "server=localhost;port=3306;database=db;user=root;password=password";
            optionsBuilder.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString));
        }
    }

      protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Quiz>()
            .HasMany(q => q.Tags)
            .WithMany(t => t.Quizzes)
            .UsingEntity(j => j.ToTable("QuizTag"));
    }
}