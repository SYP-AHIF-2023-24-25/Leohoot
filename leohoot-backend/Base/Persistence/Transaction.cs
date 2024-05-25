namespace Base.Persistence;

using System;
using System.Threading.Tasks;

using Base.Core.Contracts;

using Microsoft.EntityFrameworkCore.Storage;

public class Transaction : ITransaction
{
    public IBaseUnitOfWork UnitOfWork { get; private set; }

    public Transaction(IBaseUnitOfWork unitOfWork, IDbContextTransaction dbTran)
    {
        UnitOfWork = unitOfWork;
        _dbTran    = dbTran;
    }

    #region Transaction

    private IDbContextTransaction? _dbTran;

    public bool InTransaction => _dbTran != null;

    private void CheckInTransaction()
    {
        if (InTransaction == false)
        {
            throw new ArgumentException("A transaction was not started.");
        }
    }

    public async Task SaveChangesAsync()
    {
        CheckInTransaction();
        await UnitOfWork.SaveChangesAsync();
    }

    public async Task CommitTransactionAsync()
    {
        await SaveChangesAsync();
        await _dbTran!.CommitAsync();
        _dbTran = null;
    }

    public void RollbackTransaction()
    {
        CheckInTransaction();

        _dbTran!.Rollback();
        _dbTran = null;
    }

    #endregion

    #region dispose

    public void Dispose()
    {
        if (InTransaction)
        {
            // if commit is not called, rollback transaction now
            RollbackTransaction();
        }
    }

    #endregion
}