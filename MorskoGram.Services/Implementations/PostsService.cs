namespace MorskoGram.Services.Implementations
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;
    using Microsoft.EntityFrameworkCore;
    using MorskoGram.Data.Common.Models;
    using MorskoGram.Data.Common.Repositories;
    using MorskoGram.Data.Models;
    using MorskoGram.Services.Mapping;

    public class PostsService : IPostsService
    {
        private readonly IRepository<Post> postsRepository;
        private readonly IRepository<Follow> followsRepository;
        private readonly IRepository<Like> likesRepository;
        private readonly IDropboxService dropboxService;

        public PostsService(
            IRepository<Post> postsRepository,
            IRepository<Follow> followsRepository,
            IRepository<Like> likesRepository,
            IDropboxService dropboxService
        )
        {
            this.postsRepository = postsRepository;
            this.followsRepository = followsRepository;
            this.likesRepository = likesRepository;
            this.dropboxService = dropboxService;
        }

        public async Task<ICollection<T>> GetFewForUserAsync<T>(string userId, DateTime? referenceDate, int count = 5)
            where T : IMapFrom<Post>
            => await this.postsRepository
                .AllAsNoTracking()
                .Where(x => x.CreatorId == userId && x.CreatedOn < (referenceDate ?? DateTime.UtcNow))
                .OrderByDescending(x => x.CreatedOn)
                .To<T>()
                .Take(count)
                .ToListAsync();

        public async Task<ICollection<T>> GetFewForFeed<T>(string userId, DateTime? referenceDate, int count = 5)
            where T : IMapFrom<Post> =>
            await this.followsRepository
                .AllAsNoTracking()
                .Where(x => x.FollowerId == userId)
                .Select(x => x.Followed)
                .SelectMany(x => x.Posts)
                .Concat(this.postsRepository.AllAsNoTracking()
                    .Where(x => x.CreatorId == userId))
                .OrderByDescending(x => x.CreatedOn)
                .Where(x => x.CreatedOn < (referenceDate ?? DateTime.UtcNow))
                .Take(count)
                .To<T>()
                .ToListAsync();

        public async Task<T> GetByIdAsync<T>(Guid id) where T : IMapFrom<Post>
            => await this.postsRepository
                .AllAsNoTracking()
                .Where(x => x.Id == id)
                .To<T>()
                .FirstOrDefaultAsync();

        public async Task<TOut> CreateAsync<TIn, TOut>(TIn model)
            where TIn : IMapTo<Post>
            where TOut : IMapFrom<Post>
        {
            var post = AutoMapperConfig.MapperInstance.Map<TIn, Post>(model);
            await this.postsRepository.AddAsync(post);
            await this.postsRepository.SaveChangesAsync();
            return AutoMapperConfig.MapperInstance.Map<Post, TOut>(post);
        }

        public async Task DeleteAsync(Guid? id, bool withImage = true)
        {
            var post = await this.postsRepository.All()
                .FirstOrDefaultAsync(x => x.Id == id);

            var imageId = post.ImageId;
            this.postsRepository.Delete(post);
            await this.postsRepository.SaveChangesAsync();

            if (withImage)
            {
                await this.dropboxService.DeleteAsync(imageId); // TODO: Make implementation for deletion by link
            }
        }

        public Task<bool> IsUserPostOwnerAsync(string userId, Guid postId)
            => this.postsRepository
                .AllAsNoTracking()
                .AnyAsync(x => x.Id == postId && x.CreatorId == userId);

        public async Task<TOut> EditAsync<TIn, TOut>(Guid id, TIn model)
            where TIn : IMapTo<Post>
            where TOut : IMapFrom<Post>
        {
            var oldPost = await this.postsRepository.All()
                .FirstOrDefaultAsync(x => x.Id == id);
            var newPost = AutoMapperConfig.MapperInstance.Map(model, oldPost);
            await this.postsRepository.SaveChangesAsync();
            return await this.postsRepository
                .AllAsNoTracking()
                .Where(x => x.Id == id)
                .To<TOut>()
                .FirstOrDefaultAsync();
        }

        public async Task ToggleLikeAsync(Guid id, string userId)
        {
            var like = await this.likesRepository.All().FirstOrDefaultAsync(x => x.GiverId == userId && x.PostId == id);
            if (like is null)
            {
                await this.likesRepository.AddAsync(new Like
                {
                    GiverId = userId,
                    PostId = id,
                });
            }
            else
            {
                this.likesRepository.Delete(like);
            }

            await this.likesRepository.SaveChangesAsync();
        }
    }
}
