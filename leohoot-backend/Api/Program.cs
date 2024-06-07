using System.Text;
using Api;
using Api.Hubs;
using Api.Controllers;
using Base.Persistence;
using Core.Contracts;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Tokens;
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
        .WithOrigins("https://leohoot.sophiehaider.com")
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

var jwtSettingsIntern = builder.Configuration.GetSection("JwtSettingsIntern");
var jwtSettingsKeycloak = builder.Configuration.GetSection("JwtSettingsKeycloak");
builder.Services.AddAuthentication(opt =>
    {
        opt.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
        opt.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    }).AddJwtBearer("Intern", options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtSettingsIntern["validIssuer"],
            ValidAudience = jwtSettingsIntern["validAudience"],
            IssuerSigningKey =
                new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettingsIntern.GetSection("securityKey").Value!))
        };
    })/*.AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = false,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = false,
            ValidIssuer = jwtSettingsKeycloak["validIssuer"]
        };
    })*/;

var app = builder.Build();


app.UseAuthentication();
app.UseAuthorization();

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