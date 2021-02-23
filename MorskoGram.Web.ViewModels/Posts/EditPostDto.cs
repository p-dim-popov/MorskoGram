namespace MorskoGram.Web.ViewModels.Posts
{
    using System;
    using MorskoGram.Data.Common.Models;
    using MorskoGram.Data.Models;
    using MorskoGram.Services.Mapping;

    public class EditPostDto: IMapTo<Post>
    {
        public string Caption { get; set; }
    }
}
