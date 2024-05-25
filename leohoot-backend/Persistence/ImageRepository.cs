using Base.Persistence;
using Core.Contracts;
using Core.Entities;
using Microsoft.EntityFrameworkCore;

namespace Persistence;

public class ImageRepository: GenericRepository<Image>, IImageRepository
{
    private readonly DbSet<Image> _images;

    public ImageRepository(DbSet<Image> images): base(images)
    {
        _images = images;
    }
}