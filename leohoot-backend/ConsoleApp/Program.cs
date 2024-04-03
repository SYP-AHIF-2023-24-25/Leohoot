// See https://aka.ms/new-console-template for more information

using ConsoleApp;
using Persistence;

Console.WriteLine("Hello, World!");

var quizzes = Importer.ImportQuizzes();

using (var dbContext = new ApplicationDbContext())
{
    dbContext.Database.EnsureDeleted();
    dbContext.Database.EnsureCreated();
    dbContext.Quizzes.AddRange(quizzes);
    dbContext.SaveChanges();
}