namespace MorskoGram.Web.ViewModels.Posts
{
    using System;
    using MorskoGram.Data.Common.Models;
    using MorskoGram.Data.Models;
    using MorskoGram.Services.Mapping;

    public class ListPostsViewModel: BaseModel<Guid>, IMapFrom<Post>
    {
        public string Caption { get; set; }

        public string ImageLink { get; set; }

        public string CreatorEmail { get; set; }

        public int CommentsCount { get; set; }

        public int LikesCount { get; set; }
    }
}
