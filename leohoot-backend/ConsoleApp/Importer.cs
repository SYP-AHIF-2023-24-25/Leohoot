using System.Security.Cryptography;
using System.Text.Json;
using Core;
using Core.Entities;
using Microsoft.AspNetCore.Cryptography.KeyDerivation;
using Persistence;
namespace ConsoleApp;

public class Importer
{
    public static List<Quiz> ImportQuizzes()
    {
        string jsonString = File.ReadAllText("./Files/quizzes.json");
        var quizzes =  JsonSerializer.Deserialize<List<Quiz>>(jsonString) ?? [];
        return quizzes;
    }
}