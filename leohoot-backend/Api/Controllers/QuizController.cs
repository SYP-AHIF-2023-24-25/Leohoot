using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Core;
using Microsoft.AspNetCore.Http;
using Persistence;
using ConsoleApp;
using System.Net.Http.Headers;
using System.IO;
using System.Net.Http;
using System.Threading.Tasks;
using Core.Contracts;
using Microsoft.Extensions.Options;
using Core.DataTransferObjects;
using Core.Entities;

namespace Api.Controllers;

[Route("api/quizzes")]
[ApiController]
public class QuizController : Controller
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly LeohootSettings _settings;

    public QuizController(IUnitOfWork unitOfWork, IOptions<LeohootSettings> settings)
    {
        _unitOfWork = unitOfWork;
        _settings = settings.Value;
    }
    
    [HttpGet("{quizId:int}")]
    public async Task<QuizDto?> GetQuizById(int quizId)
    {
        return await _unitOfWork.Quizzes.GetQuizDto(quizId);
    }

    [HttpGet]
    public async Task<List<QuizDto>> GetAllQuizzes()
    {
        return await _unitOfWork.Quizzes.GetAllQuizzes();
    }
    
    [HttpPost]
    public async Task<IResult> PostNewQuiz(QuizPostDto quizDto)
    {
        var quiz = new Quiz
        {
            Title = quizDto.Title,
            Description = quizDto.Description,
            CreatorName = quizDto.Creator,
            Questions = quizDto.Questions.Select(q => new Question
            {
                QuestionNumber = q.QuestionNumber,
                QuestionText = q.QuestionText,
                AnswerTimeInSeconds = q.AnswerTimeInSeconds,
                Answers = q.Answers.Select(a => new Answer
                {
                    AnswerText = a.AnswerText,
                    IsCorrect = a.IsCorrect
                }).ToList(),
                ImageName = q.ImageName,
                Snapshot = q.Snapshot,
                PreviewTime = q.PreviewTime,
                ShowMultipleChoice = q.ShowMultipleChoice
            }).ToList(),
            ImageName = quizDto.ImageName
        };

        foreach (var tagDto in quizDto.Tags)
        {
            var tag = await _unitOfWork.Tags.GetTagByName(tagDto.Name);
            if (tag == null)
            {
                tag = new Tag { Name = tagDto.Name };
                await _unitOfWork.Tags.AddAsync(tag);
            }
            quiz.Tags.Add(tag);
        }

        await _unitOfWork.Quizzes.AddAsync(quiz);
        await _unitOfWork.SaveChangesAsync();
        return Results.Created($"/api/quizzes/{quiz.Id}", quiz.Id);
    }

    [HttpPut("{quizId:int}")]
    public async Task<IResult> UpdateQuiz(int quizId, QuizPostDto quizDto)
    {
        var existingQuiz = await _unitOfWork.Quizzes.GetQuiz(quizId);
        if (existingQuiz == null)
        {
            return Results.NotFound("Quiz not found");
        }

        existingQuiz.Title = quizDto.Title;
        existingQuiz.Description = quizDto.Description;
        existingQuiz.ImageName = quizDto.ImageName;
        if (quizDto.Questions.Count == 0){
            existingQuiz.Questions.Clear();
        } else {
            existingQuiz.Questions = quizDto.Questions.Select(q => new Question
            {
                QuestionNumber = q.QuestionNumber,
                QuestionText = q.QuestionText,
                AnswerTimeInSeconds = q.AnswerTimeInSeconds,
                Answers = q.Answers.Select(a => new Answer
                {
                    AnswerText = a.AnswerText,
                    IsCorrect = a.IsCorrect
                }).ToList(),
                ImageName = q.ImageName,
                Snapshot = q.Snapshot,
                PreviewTime = q.PreviewTime,
                ShowMultipleChoice = q.ShowMultipleChoice
            }).ToList();
        }

        if (quizDto.Tags.Count == 0){
            existingQuiz.Tags.Clear();
        } else {
            existingQuiz.Tags.Clear();
             foreach (var tagDto in quizDto.Tags)
            {
                var tag = await _unitOfWork.Tags.GetTagByName(tagDto.Name);
                if (tag == null)
                {
                    tag = new Tag { Name = tagDto.Name };
                    await _unitOfWork.Tags.AddAsync(tag);
                }
                existingQuiz.Tags.Add(tag);
            }
        }

        await _unitOfWork.SaveChangesAsync();
        return Results.Ok(existingQuiz);
    }

    [HttpDelete("{quizId:int}")]
    public async Task<IResult> DeleteQuiz(int quizId)
    {
        var quiz = await _unitOfWork.Quizzes.GetQuiz(quizId);
        if (quiz == null)
        {
            return Results.NotFound("Quiz not found");
        }

        _unitOfWork.Quizzes.Remove(quiz);
        await _unitOfWork.SaveChangesAsync();
        return Results.Ok();
    }

    [HttpPost("init")]
    public async Task<IResult> InitQuizzes()
    {
        var quizzes = Importer.ImportQuizzes();
        await _unitOfWork.DeleteDatabaseAsync();
        await _unitOfWork.CreateDatabaseAsync();
        await _unitOfWork.Quizzes.AddRangeAsync(quizzes);
        await _unitOfWork.SaveChangesAsync();
        return Results.Ok();
    }

    [HttpPost("upload/images")]
    public async Task<IResult> UploadImage(IFormFile image)
    {
        var imageRow = new Image();
        await _unitOfWork.Images.AddAsync(imageRow);
        await _unitOfWork.SaveChangesAsync();

        var nextVal = imageRow.Id.ToString().PadLeft(2, '0');
        var newImageName = $"{nextVal}_{image.FileName}";

        var directoryPath = Path.Combine(_settings.ImagePath);
        var filePath = Path.Combine(directoryPath, newImageName);
        
        if (!Directory.Exists(directoryPath))
        {
            Directory.CreateDirectory(directoryPath);
        }
       
        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await image.CopyToAsync(stream);
        }

        return Results.Created($"/cdn/images/{newImageName}", newImageName);
    } 
     [HttpGet("tags")]
    public async Task<List<TagDto>> GetTags()
    {
        return await _unitOfWork.Tags.GetAllTagsAsync();
    } 

    [HttpGet("tags/{tagName}")]
    public async Task<TagDto?> GetTagByName(string tagName)
    {
        var tag = await _unitOfWork.Tags.GetTagByName(tagName);
        if (tag == null)
        {
            return null;
        }
        return new TagDto(tag.Name);
    }

    [HttpPost("tags")]
    public async Task<IResult> AddTag(TagDto tagDto)
    {
        var tag = await _unitOfWork.Tags.GetTagByName(tagDto.Name);
        if (tag != null)
        {
            return Results.BadRequest("Tag already exists");
        }

        tag = new Tag { Name = tagDto.Name };
        await _unitOfWork.Tags.AddAsync(tag);
        await _unitOfWork.SaveChangesAsync();
        return Results.Created($"/api/quizzes/tags/{tag.Name}", tag.Name);
    }

    [HttpDelete("tags/{tagName}")]
    public async Task<IResult> DeleteTag(string tagName)
    {
        var tag = await _unitOfWork.Tags.GetTagByName(tagName);
        if (tag == null)
        {
            return Results.NotFound("Tag not found");
        }

        _unitOfWork.Tags.Remove(tag);
        await _unitOfWork.SaveChangesAsync();
        return Results.Ok();
    }

    [HttpGet("{quizId}/tags")]
    public async Task<List<TagDto>> GetTagsForQuiz(int quizId)
    {
        var quiz = await _unitOfWork.Quizzes.GetQuiz(quizId);
        if (quiz == null)
        {
            return new List<TagDto>();
        }

        return quiz.Tags.Select(t => new TagDto(t.Name)).ToList();
    }

    [HttpPost("{quizId}/tags")]
    public async Task<IResult> AddTagToQuiz(int quizId, TagDto tagDto)
    {
        var quiz = await _unitOfWork.Quizzes.GetQuiz(quizId);
        if (quiz == null)
        {
            return Results.NotFound("Quiz not found");
        }

        var tag = await _unitOfWork.Tags.GetTagByName(tagDto.Name);
        if (tag == null)
        {
            return Results.NotFound("Tag not found");
        }

        quiz.Tags.Add(tag);
        await _unitOfWork.SaveChangesAsync();
        return Results.Created($"/api/quizzes/{quizId}/tags/{tag.Name}", tag.Name);
    }

    [HttpDelete("{quizId}/tags/{tagName}")]
    public async Task<IResult> RemoveTagFromQuiz(int quizId, string tagName)
    {
        var quiz = await _unitOfWork.Quizzes.GetQuiz(quizId);
        if (quiz == null)
        {
            return Results.NotFound("Quiz not found");
        }

        var tag = await _unitOfWork.Tags.GetTagByName(tagName);
        if (tag == null)
        {
            return Results.NotFound("Tag not found");
        }

        quiz.Tags.Remove(tag);
        await _unitOfWork.SaveChangesAsync();
        return Results.Ok();
    }
}