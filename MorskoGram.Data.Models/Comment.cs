namespace MorskoGram.Data.Models
{
    using System;
    using System.ComponentModel.DataAnnotations;
    using MorskoGram.Data.Common;
    using MorskoGram.Data.Common.Models;

    public class Comment: BaseModel<Guid>, IAuditInfo
    {
        [Required, MaxLength(450)]
        public string Content { get; set; }

        [Required]
        public string CreatorId { get; set; }
        public virtual ApplicationUser Creator { get; set; }

        public Guid PostId { get; set; }
        public virtual Post Post { get; set; }
    }
}
