namespace MorskoGram.Web.ViewModels.Posts
{
    using System.Collections.Generic;

    public class SearchDto
    {
        public int AvailableCount { get; set; }

        public ICollection<PostViewModel> List { get; set; }
    }
}
