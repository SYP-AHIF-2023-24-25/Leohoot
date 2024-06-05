using Base.Persistence;
using Core.Contracts;
using Core.DataTransferObjects;
using Core.Entities;
using Microsoft.EntityFrameworkCore;

namespace Persistence;

public class TagRepository: GenericRepository<Tag>, ITagRepository
{
    private readonly DbSet<Tag> _tags;

    public TagRepository(DbSet<Tag> tags): base(tags)
    {
        _tags = tags;
    }

    public async Task<Tag?> GetTagByName(string name)
    {
        return await _tags.SingleOrDefaultAsync(t => t.Name == name);
    }

    public async Task<List<TagDto>> GetAllTagsAsync()
    {
        return await _tags
                        .OrderBy(tag => tag.Name)   
                        .Select(tag => new TagDto(tag.Name))
                        .ToListAsync();
    }
}