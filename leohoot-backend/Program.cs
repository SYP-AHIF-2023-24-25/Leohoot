using LeohootBackend.Hubs;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Http.Json;
using Microsoft.EntityFrameworkCore;
using LeohootBackend;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddSignalR();
builder.Services.AddSwaggerGen();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddDbContext<DataContext>();
builder.Services.Configure<JsonOptions>(o => o.SerializerOptions.Converters
    .Add(new JsonStringEnumConverter()));

builder.Services.AddCors(options =>
{
    options.AddPolicy("CorsPolicy", builder => builder
        .WithOrigins("http://localhost:4200")
        .WithOrigins("http://140.238.173.82:8001")
        .AllowAnyMethod()
        .AllowAnyHeader()
        .AllowCredentials());
});

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<DataContext>();
    await context.Database.EnsureDeletedAsync();
    await context.Database.MigrateAsync();
    await context.InsertSampleData();
}

app.UseDefaultFiles();
app.UseStaticFiles();
app.ConfigureEndpoints();
app.UseSwaggerUI();
app.UseCors("CorsPolicy");
app.MapHub<ChatHub>("/hub");
app.Run();

