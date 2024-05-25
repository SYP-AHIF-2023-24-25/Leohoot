using System.ComponentModel.DataAnnotations;
using System.Runtime.CompilerServices;
using Base.Core.Entities;

namespace Core.Entities;

public class User: EntityObject
{
    [MaxLength(30)]
    public required string Username { get; set; }
    [MaxLength(256)]
    public required string Password { get; set; }
    [MaxLength(256)]
    public string? Salt { get; set; }
}
