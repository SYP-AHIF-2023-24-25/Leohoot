using System.ComponentModel.DataAnnotations;
using System.Runtime.CompilerServices;
using Base.Core.Entities;
using Microsoft.EntityFrameworkCore;

namespace Core.Entities;

[Index(nameof(Username), IsUnique = true)]
public class User: EntityObject
{
    [MaxLength(30)]
    public required string Username { get; set; }
    [MaxLength(256)]
    public required string Password { get; set; }
    public required byte[] Salt { get; set; }
}
