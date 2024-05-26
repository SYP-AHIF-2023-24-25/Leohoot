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
        foreach (var quiz in quizzes)
        {
            byte[] salt = RandomNumberGenerator.GetBytes(128 / 8);
            string hashedPassword = Convert.ToBase64String(KeyDerivation.Pbkdf2(
                password: quiz.Creator!.Password,
                salt: salt,
                prf: KeyDerivationPrf.HMACSHA256,
                iterationCount: 100000,
                numBytesRequested: 256 / 8)
            );
            quiz.Creator.Password = hashedPassword;
            quiz.Creator.Salt = salt;
        }
        return quizzes;
    }
}