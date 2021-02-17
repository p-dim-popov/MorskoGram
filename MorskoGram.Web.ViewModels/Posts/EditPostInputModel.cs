﻿namespace MorskoGram.Web.ViewModels.Posts
{
    using System.ComponentModel.DataAnnotations;

    public class EditPostInputModel
    {
        [MaxLength(450)]
        public string Description { get; set; }
    }
}
