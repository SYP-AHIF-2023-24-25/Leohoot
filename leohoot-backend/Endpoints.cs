using Microsoft.EntityFrameworkCore;

namespace LeohootBackend;

public static class Endpoints
{
    public static void ConfigureEndpoints(this WebApplication app)
    {
        ConfigureUserEndpoints(app);
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
    }
}