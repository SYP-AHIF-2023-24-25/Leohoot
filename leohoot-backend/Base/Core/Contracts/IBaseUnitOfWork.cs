namespace Base.Core.Contracts;

using System;
using System.Threading.Tasks;

public interface IBaseUnitOfWork : IDisposable, IAsyncDisposable
{
    ITransaction BeginTransaction();

    Task<int> SaveChangesAsync();
    Task DeleteDatabaseAsync();
    Task MigrateDatabaseAsync();
    Task CreateDatabaseAsync();
}