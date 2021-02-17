namespace MorskoGram.Web.ViewModels.Posts
{
    using System;
    using System.Collections.Generic;
    using MorskoGram.Data.Models;
    using MorskoGram.Services.Mapping;

    public class ListPostsViewModel: IMapFrom<Post>
    {
        public Guid Id { get; set; }
        
        public string Description { get; set; }

        public string ImageLink { get; set; }

        public string CreatorEmail { get; set; }

        public int CommentsCount { get; set; }

        public int LikesCount { get; set; }
        
        public DateTime CreatedOn { get; set; }

        public DateTime? ModifiedOn { get; set; }
    }
}
