namespace MorskoGram.Web.ViewModels.Users
{
    using System.Collections.Generic;
    using MorskoGram.Data.Models;
    using MorskoGram.Services.Mapping;
    using MorskoGram.Web.ViewModels.Follows;

    public class UserViewModel : IMapFrom<ApplicationUser>
    {
        public string Id { get; set; }

        public string Email { get; set; }

        public ICollection<FollowViewModel> Followers { get; set; }

        public ICollection<FollowViewModel> Followings { get; set; }
    }
}
