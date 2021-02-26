namespace MorskoGram.Services
{
    using System;
    using System.Threading.Tasks;

    public interface IFollowsService
    {
        Task ToggleFollowAsync(string followerId, Guid followedId);

        Task<bool> IsUserFollowingUserAsync(string followerId, string followedId);
    }
}
