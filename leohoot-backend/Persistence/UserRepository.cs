using Base.Persistence;
using Core.Contracts;
using Core.Entities;
using Microsoft.EntityFrameworkCore;

namespace Persistence;

public class UserRepository: GenericRepository<User>,IUserRepository
{
    private readonly DbSet<User> _users;

    public UserRepository(DbSet<User> users): base(users)
    {
        _users = users;
    }

    public async Task<User?> GetUserByUsername(string username)
    {
        var user = await _users.SingleOrDefaultAsync(user => user.Username == username);
        return user;
    }
}