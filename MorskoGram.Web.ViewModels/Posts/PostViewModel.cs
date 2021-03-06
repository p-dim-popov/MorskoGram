﻿namespace MorskoGram.Web.ViewModels.Posts
{
    using System;
    using System.Collections.Generic;
    using MorskoGram.Data.Common.Models;
    using MorskoGram.Data.Models;
    using MorskoGram.Services.Mapping;

    public class PostViewModel : BaseModel<Guid>, IMapFrom<Post>
    {
        public string Caption { get; set; }

        public string ImageLink { get; set; }

        public string CreatorEmail { get; set; }

        public string CreatorId { get; set; }

        public ICollection<Comment> Comments { get; set; }

        public ICollection<Like> Likes { get; set; }
    }
}
