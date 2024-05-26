using Base.Core.Contracts;
using Core.DataTransferObjects;
using Core.Entities;

namespace Core.Contracts;

public interface IUserRepository: IGenericRepository<User>
{
    public Task<User?> GetUserByUsername(string username);
}