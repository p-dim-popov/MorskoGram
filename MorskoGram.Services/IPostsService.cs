namespace MorskoGram.Services
{
    using System;
    using System.Collections.Generic;
    using System.Threading.Tasks;
    using MorskoGram.Data.Common.Models;
    using MorskoGram.Data.Models;
    using MorskoGram.Services.Mapping;

    public interface IPostsService
    {
        Task<ICollection<T>> GetFewForUserAsync<T>(string userId, DateTime? referenceDate, int count = 5)
            where T : IMapFrom<Post>;

        Task<ICollection<T>> GetFewForFeed<T>(string userId, DateTime? referenceDate, int count = 5)
            where T : IMapFrom<Post>;

        Task<T> GetByIdAsync<T>(Guid id) where T : IMapFrom<Post>;

        Task<TOut> CreateAsync<TIn, TOut>(TIn model)
            where TIn : IMapTo<Post>
            where TOut: IMapFrom<Post>;

        Task DeleteAsync(Guid? id, bool withImage = true);

        Task<bool> IsUserPostOwnerAsync(string userId, Guid postId);

        Task<TOut> EditAsync<TIn, TOut>(Guid id, TIn dto)
            where TIn : IMapTo<Post>
            where TOut : IMapFrom<Post>;

        Task ToggleLikeAsync(Guid id, string userId);
    }
}
