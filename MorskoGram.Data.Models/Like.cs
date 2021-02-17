namespace MorskoGram.Data.Models
{
    using System;
    using System.ComponentModel.DataAnnotations;
    using MorskoGram.Data.Common;
    using MorskoGram.Data.Common.Models;

    public class Like: BaseModel<Guid>, IAuditInfo
    {
        [Required]
        public string GiverId { get; set; }
        public virtual ApplicationUser Giver { get; set; }

        public Guid PostId { get; set; }
        public virtual Post Post { get; set; }
    }
}
