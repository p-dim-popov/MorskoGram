namespace MorskoGram.Web.ViewModels.Posts
{
    using System;
    using System.Collections.Generic;
    using MorskoGram.Data.Models;
    using MorskoGram.Services.Mapping;

    public class PostViewModel : IMapFrom<Post>
    {
        public Guid Id { get; set; }

        public string Description { get; set; }

        public string ImageLink { get; set; }

        public string CreatorEmail { get; set; }

        public ICollection<Comment> Comments { get; set; }

        public ICollection<Like> Likes { get; set; }
        
        public DateTime CreatedOn { get; set; }

        public DateTime? ModifiedOn { get; set; }
    }
}
