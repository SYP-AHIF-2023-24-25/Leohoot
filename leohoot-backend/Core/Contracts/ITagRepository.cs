
using Base.Core.Contracts;
using Core.DataTransferObjects;
using Core.Entities;

namespace Core.Contracts;

public interface ITagRepository: IGenericRepository<Tag>
{
    Task<Tag?> GetTagByName(string name);

    Task<List<TagDto>> GetAllTagsAsync();
}