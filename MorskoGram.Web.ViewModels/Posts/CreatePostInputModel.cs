namespace MorskoGram.Web.ViewModels.Posts
{
    using System.ComponentModel.DataAnnotations;
    using Microsoft.AspNetCore.Http;

    public class CreatePostInputModel
    {
        [MaxLength(450)]
        public string Caption { get; set; }

        [Required]
        public IFormFile Image { get; set; }
    }
}
