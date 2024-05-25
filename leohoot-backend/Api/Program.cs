using Api;
using Api.Hubs;
using Api.Controllers;
using Base.Persistence;
using Core.Contracts;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Persistence;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddControllers();
builder.Services.AddSignalR();
builder.Services.AddCors(options =>
{
    options.AddPolicy("CorsPolicy", b => b
        .WithOrigins("http://localhost:4200")
        .WithOrigins("http://140.238.173.82:8000")
        .WithOrigins("http://leohoot.sophiehaider.com")
        .AllowAnyMethod()
        .AllowAnyHeader()
        .AllowCredentials());
});

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<ApplicationDbContext>(options =>
{
    options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString));
});
builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();
builder.Services.Configure<LeohootSettings>(builder.Configuration.GetSection("LeohootSettings"));

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

GameController.HubContext = app.Services.GetRequiredService<IHubContext<LeohootHub>>();

app.UseHttpsRedirection();
app.MapControllers();
app.UseCors("CorsPolicy");
app.MapHub<LeohootHub>("/hub");
app.Run();