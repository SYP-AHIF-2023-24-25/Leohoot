using System.Text.Json;
using Core;
using Persistence;
namespace ConsoleApp;

public class Importer
{
    public static List<Quiz> ImportQuizzes()
    {
        string jsonString = File.ReadAllText("../Files/quizzes.json");
        return JsonSerializer.Deserialize<List<Quiz>>(jsonString) ?? [];
    }
}