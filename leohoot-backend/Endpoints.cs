using Microsoft.EntityFrameworkCore;
using LeohootBackend.Model;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;

namespace LeohootBackend;

public static class Endpoints
{
    public static void ConfigureEndpoints(this WebApplication app)
    {
        ConfigureUserEndpoints(app);
        ConfigureQuizEndpoints(app);
        ConfigureQuestionEndpoints(app);
    }

    private static void ConfigureUserEndpoints(IEndpointRouteBuilder endpoints)
    {
        endpoints.MapGet("/api/users", async (DataContext ctx)=>
        {
            return await ctx.Users.ToListAsync();
        });

        endpoints.MapGet("/api/users/{username}", async (DataContext ctx, string username)=>
        {
            return await ctx.Users.Where(u => u.Username == username).FirstOrDefaultAsync();
        });
        
        endpoints.MapPost("/api/users", (DataContext ctx, User user)=>
        {
            return StatusCodes.Status400BadRequest;
        });

        endpoints.MapPut("/api/users/{username}", (DataContext ctx, string username, User user)=>
        {
            return StatusCodes.Status400BadRequest;
        });
    }

    private static void ConfigureQuizEndpoints(IEndpointRouteBuilder endpoints)
    {
        endpoints.MapGet("/api/quizzes", async (DataContext ctx)=>
        {
            return await ctx.Quizzes
                .Include(q => q.Questions)
                .ThenInclude(q => q.Answers)
                .Include(q => q.Questions)
                .ThenInclude(q => q.NextQuestion)
                .ToListAsync();
        });

        endpoints.MapGet("/api/quizzes/{quizId}", async (DataContext ctx, int quizId)=>
        {
            return await ctx.Quizzes.Where(q => q.QuizId == quizId).FirstOrDefaultAsync();
        });
        
        endpoints.MapPost("/api/quizzes", (DataContext ctx, Quiz quiz)=>
        {
            return StatusCodes.Status400BadRequest;
        });

        endpoints.MapPut("/api/quizzes/{quizId}", (DataContext ctx, int quizId, Quiz quiz)=>
        {
            return StatusCodes.Status400BadRequest;
        });
    }

    private static void ConfigureQuestionEndpoints(IEndpointRouteBuilder endpoints)
    {
        endpoints.MapGet("/api/questions", async (DataContext ctx)=>
        {
            return await ctx.Questions.ToListAsync();
        });

        //Teacher gets all information about the question
        //Student gets only the question text, count of answer choices
        endpoints.MapGet("/api/questions/{questionId}", (DataContext ctx, int questionId, string username)=>
        {
            return StatusCodes.Status400BadRequest;
        });
    }
}