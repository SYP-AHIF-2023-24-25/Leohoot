// See https://aka.ms/new-console-template for more information

using ConsoleApp;
using Microsoft.EntityFrameworkCore;
using Persistence;

Console.WriteLine("Hello, World!");

var quizzes = Importer.ImportQuizzes();

using (var dbContext = new ApplicationDbContext())
{
    dbContext.Database.EnsureDeleted();
    dbContext.Database.Migrate();

    dbContext.Quizzes.AddRange(quizzes);
    dbContext.SaveChanges();
}

 /*// Pfad zum Bild, das hochgeladen werden soll
string imagePath = "../../images/test.png";


// Erstelle einen HttpClient
try
{
    using (var client = new HttpClient())
    using (var formData = new MultipartFormDataContent())
    {
        var fileStream = File.Open(imagePath, FileMode.Open);
        var fileName = Path.GetFileName(imagePath);
        formData.Add(new StreamContent(fileStream), "file", fileName);

        var response = await client.PostAsync("http://localhost/cdn/upload", formData);

        if (response.IsSuccessStatusCode)
        {
            Console.WriteLine("Bild erfolgreich hochgeladen!");
        }
        else
        {
            Console.WriteLine("Fehler beim Hochladen des Bildes. Statuscode: " + response.StatusCode);
        }
    }
}
catch (Exception ex)
{
    Console.WriteLine("Fehler: " + ex.Message);
}*/