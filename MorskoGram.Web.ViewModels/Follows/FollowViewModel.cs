namespace MorskoGram.Web.ViewModels.Follows
{
    using MorskoGram.Data.Models;
    using MorskoGram.Services.Mapping;

    public class FollowViewModel : IMapFrom<Follow>
    {
        public string FollowerId { get; set; }

        public string FollowerEmail { get; set; }

        public string FollowedId { get; set; }

        public string FollowedEmail { get; set; }
    }
}
