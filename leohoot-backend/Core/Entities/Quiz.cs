using System;
using System.ComponentModel.DataAnnotations;
using Base.Core.Entities;

namespace Core.Entities;
public class Quiz: EntityObject
{
    [MaxLength(256)]
    public required string Title { get; set; }

    [MaxLength(800)]
    public string? Description { get; set; }

    public int CreatorId { get; set; }
    
    [MaxLength(30)]
    public required string CreatorName { get; set; }

    [MaxLength(256)]
    public string? ImageName { get; set; }

    public bool IsPublic { get; set; }

    public List<Question> Questions { get; set; } = [];

    public List<Tag> Tags { get; set; } = [];
}
