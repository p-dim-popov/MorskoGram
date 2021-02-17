namespace MorskoGram.Web.ViewModels.Posts
{
    using System;
    using MorskoGram.Data.Models;
    using MorskoGram.Services.Mapping;

    public class CreatePostDto : IMapTo<Post>
    {
        public Guid Id { get; set; }

        public string Description { get; set; }

        public string ImageLink { get; set; }

        public string CreatorId { get; set; }

        public Guid ImageId { get; set; }
    }
}
