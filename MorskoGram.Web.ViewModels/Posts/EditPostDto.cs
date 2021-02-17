namespace MorskoGram.Web.ViewModels.Posts
{
    using System;
    using MorskoGram.Data.Common.Models;
    using MorskoGram.Data.Models;
    using MorskoGram.Services.Mapping;

    public class EditPostDto: BaseModel<Guid>, IMapTo<Post>
    {
        public string Description { get; set; }
    }
}
