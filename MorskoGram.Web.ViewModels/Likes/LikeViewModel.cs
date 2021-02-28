namespace MorskoGram.Web.ViewModels.Likes
{
    using System;
    using MorskoGram.Data.Models;
    using MorskoGram.Services.Mapping;

    public class LikeViewModel: IMapFrom<Like>
    {
        public Guid GiverId { get; set; }
    }
}
