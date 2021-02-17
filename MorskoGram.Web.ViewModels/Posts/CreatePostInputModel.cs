namespace MorskoGram.Web.ViewModels.Posts
{
    using System.ComponentModel.DataAnnotations;
    using Microsoft.AspNetCore.Http;
    using Microsoft.AspNetCore.Mvc;
    using MorskoGram.Data.Models;
    using MorskoGram.Services.Mapping;

    public class CreatePostInputModel
    {
        [MaxLength(450)]
        public string Description { get; set; }

        [Required]
        [FromForm]
        public IFormFile Image { get; set; }
    }
}
