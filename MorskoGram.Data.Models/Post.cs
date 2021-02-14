namespace MorskoGram.Data.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using MorskoGram.Data.Common;
    using MorskoGram.Data.Common.Models;

    public class Post: BaseModel<Guid>, IAuditInfo
    {
        [MaxLength(450)]
        public string Description { get; set; }

        [Required, MaxLength(150)]
        public string ImageLink { get; set; }

        [Required]
        public virtual ApplicationUser Creator { get; set; }

        public virtual ICollection<Comment> Comments { get; set; } = new HashSet<Comment>();

        public virtual ICollection<Like> Likes { get; set; } = new HashSet<Like>();
    }
}
