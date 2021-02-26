namespace MorskoGram.Services.Implementations
{
    using System;
    using System.Threading.Tasks;
    using Microsoft.EntityFrameworkCore;
    using MorskoGram.Data.Common.Repositories;
    using MorskoGram.Data.Models;

    public class FollowsService : IFollowsService
    {
        private readonly IRepository<Follow> followRepository;

        public FollowsService(IRepository<Follow> followRepository)
        {
            this.followRepository = followRepository;
        }

        public async Task ToggleFollowAsync(string followerId, Guid followedId)
        {
            var follow = await this.followRepository
                .All()
                .FirstOrDefaultAsync(x => x.FollowerId == followerId
                                          && x.FollowedId == followedId.ToString());

            if (follow is null)
            {
                await this.followRepository.AddAsync(new Follow
                {
                    FollowerId = followerId,
                    FollowedId = followedId.ToString()
                });
            }
            else
            {
                this.followRepository.Delete(follow);
            }

            await this.followRepository.SaveChangesAsync();
        }

        public Task<bool> IsUserFollowingUserAsync(string followerId, string followedId)
        {
            throw new System.NotImplementedException();
        }
    }
}
